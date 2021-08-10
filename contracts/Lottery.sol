pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;
    address public lastWinner;

    function Lottery() public {
        manager = msg.sender; //global variable, always available
    }
    
    function enter() public payable {
        require(msg.value > .01 ether); //used for validation
        players.push(msg.sender);
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
    }
    
    function selectWinner() public restricted {
        uint index = random() % players.length; //sudo random
        players[index].transfer(this.balance); //how mush wei we want to send    
        lastWinner = players[index];
        players = new address[](0);//brand new dynamic array of addresses 
        //to reset contract's state
    }
    
    modifier restricted() {
        require(msg.sender == manager);//only manager can call this function
        _; //function body where modifier is specified would be placed here
    }
    
    function random() private view returns (uint) {
        return uint(keccak256(block.difficulty, now, players));
        
    }
    
}
