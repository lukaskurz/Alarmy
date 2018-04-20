import mysql from "mysql";
import fs from "fs";
import Promise from "promise";
export class DatabaseClient {
    public Client: mysql.Connection;
    public constructor(private Config = new DatabaseClientConfiguration) {
        this.Client = mysql.createConnection({
            host: Config.Url,
            port: Config.Port,
            user: Config.Username,
            password: Config.Password,
            database: Config.DatabaseName
        });

        this.Connect().then(()=>{
            return this.ExistTables();
        }).then(value => {
            
        })
    }

    private Connect() {
        return new Promise((resolve, reject) => {
            this.Client.connect(function (this: DatabaseClient, err: Object) {
                if (err) {
                    reject(err);
                    return;
                }
                console.log("Connected to database");
                resolve();
                return;
            }.bind(this));
        });
    }

    private CreateTables() {
        let statements = [
            `CREATE TABLE messages
            (
                id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
                senddate timestamp NOT NULL,
                type int NOT NULL,
                content longtext
            )`,
            `CREATE UNIQUE INDEX messages_id_uindex ON messages (id);`
        ];

        return new Promise((resolve, reject)=>{
            for (const statement of statements) {
                this.Client.query(statement, function (this: DatabaseClient, err: mysql.MysqlError, result: Object) {
                    if (err) {
                        reject(err);
                        return
                    }
                    resolve(result);
                    return;
                }.bind(this));
            }
        });
    }

    private ExistTables() {
        let statement =
            `SELECT TABLE_NAME AS tablename 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = 'messages'`;

        return new Promise((resolve, reject) => {
            this.Client.query(statement, function (this: DatabaseClient, err: Object, result: Object[]) {
                if (err) reject(err);
                if (result.length == 1) {
                    console.log("Tables already exist")
                    
                    return true;
                } else {
                    console.log("Tables dont exist yet");
                    
                    return false;
                }
            });
        })
    }
}

export class DatabaseClientConfiguration {
    Url = "localhost";
    Port = 3306;
    DatabaseName = "alarmy";
    Username = "nodelogger";
    Password = "nodelogger.password";
}