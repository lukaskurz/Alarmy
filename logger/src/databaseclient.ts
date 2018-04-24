import mysql, { MysqlError } from "mysql";
import fs from "fs";
import Promise from "promise";

/**
 * Client that handles the database connection and simple database functionality.
 */
export class DatabaseClient {
	private Client: mysql.Connection;

	/**
	 * Configures the database client, but does not start the connection
	 * @param Config If left empty, uses the default values for configuration
	 */
	public constructor(private Config: DatabaseClientConfiguration = new DatabaseClientConfiguration()) {
		this.Client = mysql.createConnection({
			host: Config.Url,
			port: Config.Port,
			user: Config.Username,
			password: Config.Password,
			database: Config.DatabaseName,
		});
	}

	/**
	 * Inserts a message into the database
	 * @param type The type of the message
	 * @param timestamp Timestamp, when the message was sent
	 * @param topic The topic, to which the message was published
	 * @param content The content of the message
	 */
	public Insert(type: number, timestamp:Date, topic:string, content: string): Promise<{}> {

		//Converts the timestamp to format used by the TIMESTAMP() function
		let iso = timestamp.toISOString();
		let date = iso.substring(0,10);
		let time = iso.substr(11,iso.length - 12);
		let datetime = `${date} ${time}`;

		//Insert statement
		const statement: string = `INSERT INTO messages(topic, senddate, type, content)
		VALUES (${mysql.escape(topic)},TIMESTAMP(${mysql.escape(datetime)}), ${mysql.escape(type)}, ${mysql.escape(content)});`

		//Creates a promise for the insert statement
		return new Promise((resolve, reject) => {
			this.Client.query(statement, function (this: DatabaseClient, err: MysqlError, result: Object) {
				if (err) {
					reject(err);
					return;
				}
				resolve();
				return;
			}.bind(this));
		});
	}

	/**
	 * Connects to the database
	 */
	public Connect(): Promise<{}> {
		//Return a promise for the connecting process
		return new Promise((resolve, reject) => {
			this.Client.connect(
				function (this: DatabaseClient, err: Object): void {
					if (err) {
						reject(err);
						return;
					}
					resolve();
					return;
				}.bind(this)
			);
		})
		//After connecting, it checks if the tables already exist
		.then(() => {
			return this.ExistTables();
		})
		//If the tables dont exist, create them
		.then(value => {
			if (value === false) {
				return this.CreateTables();
			}
			//The complete connecting process is done
			return Promise.resolve();
		});;
	}

	/**
	 * Creates the necessary tables
	 */
	public CreateTables(): Promise<{}> {

		//The create statement
		const statements: string[] = [
			`CREATE TABLE messages
            (
				id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
				topic TEXT,
                senddate TIMESTAMP NOT NULL,
                type int NOT NULL,
                content LONGTEXT
            )`,
			`CREATE UNIQUE INDEX messages_id_uindex ON messages (id);`,
		];

		//Returns promise for the creating process
		return new Promise((resolve, reject) => {
			//First, create the table
			this.Client.query(
				statements[0],
				function (this: DatabaseClient, err: mysql.MysqlError, result: Object): void {
					if (err) {
						reject(err);
						return;
					}
					resolve(result);
					return;
				}.bind(this)
			);
		}).then(() => {
			return new Promise((resolve, reject) => {
				//Second create the index for the autoincrement
				this.Client.query(
					statements[1],
					function (this: DatabaseClient, err: mysql.MysqlError, result: Object): void {
						if (err) {
							reject(err);
							return;
						}
						resolve(result);
						return;
					}.bind(this)
				);
			})
		});
	}

	/**
	 * Check if the necessary tables already exist
	 */
	public ExistTables(): Promise<boolean> {

		const statement: string = `SELECT TABLE_NAME AS tablename
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_NAME = 'messages'`;

		//Returns promise for the process of checking whether the tables exist
		return new Promise((resolve, reject) => {
			this.Client.query(statement, function (this: DatabaseClient, err: Object, result: Object[]): void {
				if (err) {
					reject(err);
					return;
				}
				//The table already exists
				if (result.length === 1) {
					resolve(true);
					return;
				} else {	//The table doesn't exist yet
					resolve(false);
					return;
				}
			});
		});
	}
}

export class DatabaseClientConfiguration {
	Url = "localhost";
	Port = 3306;
	DatabaseName = "alarmy";
	Username = "nodelogger";
	Password = "nodelogger.password";
}
