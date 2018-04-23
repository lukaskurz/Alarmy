import mysql, { MysqlError } from "mysql";
import fs from "fs";
import Promise from "promise";
export class DatabaseClient {
	public Client: mysql.Connection;
	public constructor(private Config: DatabaseClientConfiguration = new DatabaseClientConfiguration()) {
		this.Client = mysql.createConnection({
			host: Config.Url,
			port: Config.Port,
			user: Config.Username,
			password: Config.Password,
			database: Config.DatabaseName,
		});
	}

	public Insert(type: number, timestamp:Date, topic:string, content: string): Promise<{}> {
		let iso = timestamp.toISOString();
		let date = iso.substring(0,10);
		let time = iso.substr(11,iso.length - 12)

		const statement: string = `INSERT INTO messages(topic, timestamp, type, content)
		VALUES ('${topic}','${date} ${time}', ${type}, '${content}');`

		return new Promise((resolve, reject) => {
			this.Client.query(statement, function (this: DatabaseClient, err: MysqlError, result: Object) {
				if (err) {
					console.log("Inserting into database failed")
					reject(err);
					return;
				}
				console.log("Inserted into database");
				resolve();
				return;
			}.bind(this));
		});
	}

	public Connect(): Promise<{}> {
		return new Promise((resolve, reject) => {
			this.Client.connect(
				function (this: DatabaseClient, err: Object): void {
					if (err) {
						console.log("Connecting to database failed")
						reject(err);
						return;
					}
					console.log("Connected to database");
					resolve();
					return;
				}.bind(this)
			);
		}).then(() => {
			return this.ExistTables();
		})
		.then(value => {
			if (value === false) {
				return this.CreateTables();
			}
			return Promise.resolve();
		});;
	}

	public CreateTables(): Promise<{}> {
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

		return new Promise((resolve, reject) => {
			this.Client.query(
				statements[0],
				function (this: DatabaseClient, err: mysql.MysqlError, result: Object): void {
					if (err) {
						console.log("Creating tables failed")
						reject(err);
						return;
					}
					console.log("Created tables");
					resolve(result);
					return;
				}.bind(this)
			);
		}).then(() => {
			return new Promise((resolve, reject) => {
				this.Client.query(
					statements[1],
					function (this: DatabaseClient, err: mysql.MysqlError, result: Object): void {
						if (err) {
							console.log("Creating index failed")
							reject(err);
							return;
						}
						console.log("Created index");
						resolve(result);
						return;
					}.bind(this)
				);
			})
		});
	}

	public ExistTables(): Promise<boolean> {
		const statement: string = `SELECT TABLE_NAME AS tablename
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_NAME = 'messages'`;

		return new Promise((resolve, reject) => {
			this.Client.query(statement, function (this: DatabaseClient, err: Object, result: Object[]): void {
				if (err) {
					console.log("Checking if tables existed failed")
					reject(err);
					return;
				}
				if (result.length === 1) {
					console.log("Tables already exist");
					resolve(true);
					return;
				} else {
					console.log("Tables dont exist yet");
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
