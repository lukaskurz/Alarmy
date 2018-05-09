class MessageJson {
	constructor(messagetype, content) {
		this.messagetype = messagetype;
		this.content = content;
		this.secret = localStorage.getItem("alarmy-secret");
	}
	messagetype = "";
	content = "";
	secret = "";
}
