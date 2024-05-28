import {Record} from "@/models/team/Record.js";

export class TeamWithRecords {
    constructor(records = []) {
        this.records = records;
    }
}
