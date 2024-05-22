import "@stdlib/deploy";

@name(set_code)
native setCode(code: Cell);

@name(set_data)
native setData(d: Cell);

message Add {
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

contract TactV0 with Deployable {
    id: Int as uint32;
    counter: Int as uint32;

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
}
