import mysql from "mysql";
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

		this.Connect()
			.then(() => {
				return this.ExistTables();
			})
			.then(value => {
				if(value === false) {
					return this.CreateTables();
				}
				return Promise.resolve();
			});
	}

	private Connect(): Promise<{}> {
		return new Promise((resolve, reject) => {
			this.Client.connect(
				function(this: DatabaseClient, err: Object): void {
					if (err) {
						reject(err);
						return;
					}
					console.log("Connected to database");
					resolve();
					return;
				}.bind(this)
			);
		});
	}

	private CreateTables(): Promise<{}> {
		let statements: string[] = [
			`CREATE TABLE messages
            (
                id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                senddate timestamp NOT NULL,
                type int NOT NULL,
                content longtext
            )`,
			`CREATE UNIQUE INDEX messages_id_uindex ON messages (id);`,
		];

		return new Promise((resolve, reject) => {
			for (const statement of statements) {
				this.Client.query(
					statement,
					function(this: DatabaseClient, err: mysql.MysqlError, result: Object): void {
						if (err) {
							reject(err);
							return;
						}
						console.log("Creating Tables");
						resolve(result);
						return;
					}.bind(this)
				);
			}
		});
	}

	private ExistTables(): Promise<boolean> {
		let statement: string = `SELECT TABLE_NAME AS tablename
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_NAME = 'messages'`;

		return new Promise((resolve, reject) => {
			this.Client.query(statement, function(this: DatabaseClient, err: Object, result: Object[]): void {
				if (err) {
					reject(err);
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
