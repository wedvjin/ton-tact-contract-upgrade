import "@stdlib/deploy";

@name(set_code)
native setCode(code: Cell);

@name(set_data)
native setData(d: Cell);

message Add {
    queryId: Int as uint64;
    amount: Int as uint32;
}

message Subtract {
    queryId: Int as uint64;
    amount: Int as uint32;
}

message Upgrade {
    newCode: Cell;
    newData: Cell;
}

message UpgradeCode {
    newCode: Cell;
}

message UpgradeData {
    newData: Cell;
}

struct InC {
    id: Int;
    counter: Int;
}

contract TactV0 with Deployable {
    id: Int as uint32 = 1;
    counter: Int as uint32;
    //upgrade v2
    version: Int as uint32 = 2;

    init(id: Int) {
        self.id = id;
        self.counter = 0;
    }

    receive(msg: Add) {
        self.counter += msg.amount;
    }

    get fun counter(): Int {
        return self.counter;
    }

    get fun id(): Int {
        return self.id;
    }

    receive(msg: Upgrade) {
        setCode(msg.newCode);
        setData(msg.newData);
    }

    receive(msg: UpgradeCode) {
        setCode(msg.newCode);
    }

    receive(msg: UpgradeData) {
        setData(msg.newData);
    }

    //UPGRADE v1
    get fun data(): InC {
        return InC {
            id: self.id,
            counter: self.counter
        };
    }

    receive(msg: Subtract) {
        self.counter -= msg.amount;
    }
}
