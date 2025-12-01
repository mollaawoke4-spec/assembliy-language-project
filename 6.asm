.MODEL SMALL
.DATA
    ARRAY DB 16 DUP(?)
          DB 29H
          DB 20 DUP(?)

.CODE
.STARTUP
    MOV BX, OFFSET ARRAY
    MOV DI, 10H
    MOV AL, [BX+DI]
    MOV DI, 20H
    MOV [BX+DI], AL

.EXIT
END