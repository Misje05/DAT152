package no.hvl.dat152.tasklist.enums;

public enum TaskStatuses {
	WAITING("WAITING"), ACTIVE("ACTIVE"), DONE("DONE");
    
    private final String name;
    
    TaskStatuses(String name) {
        this.name = name;
    }
    public String toString() {
        return this.name;
    }
}
