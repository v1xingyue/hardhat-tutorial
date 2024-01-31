pragma solidity ^0.8.9;

contract Hello {
    struct Person {
        string name;
        uint age;
        uint height;
        bool senior;
    }

    string public name = "Hello";

    Person public person =
        Person({name: "John Brown", age: 32, height: 190, senior: true});
    // address payable public owner;
    // constructor() payable {
    //     owner = payable(msg.sender);
    // }
}
