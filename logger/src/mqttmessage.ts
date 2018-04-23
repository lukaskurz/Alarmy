export class MqttMessage{
    public constructor(public Type:number, public Timestamp:Date, public Content:string, public Topic:string){}
}