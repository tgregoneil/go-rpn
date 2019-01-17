### go-rpn

DESCR

RPN Calculator: Arithmetic ops and stack manipulation.
Both keyboard events and mouse clicks are supported. The keyboard shortcuts are the the first letter of each key.

Operations supportted:

    chs: change sign
    EEX: exponentiation, 1E2 = 100, 1E-2 = 0.01
    swap: exchange x and y values
    drop: pop x off the stack
    last: restores stack if last op was arithmetic op or a drop. Only the last operation is supported
    Enter: If editing the x register, finalizes edit of x
    b: undoes the last character entered, if editing x. if not in edit mode, x is dropped. Backspace (delete on a Mac) does same thing.
    +, -, x, /: pops x and y off the stack, performs the operation and then pushes the result back onto the stack ('*' is also supported for multiplication)

While editing x, the color of x is darkgrey to indicate that edit mode is true. Once edit mode is exited (by enter or any other operation), the color changes to black.

