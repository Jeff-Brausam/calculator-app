class Calculator{
    constructor(){
        this.displayView = document.querySelector('.calculator__screen');
        this.displayValue = 0;
        this.inputNum = '';
        this.result = ''; 
        this.firstOp = null;
        this.waitingForSecondOp = false;
        this.operator = null;
        this.operators = {
            '+': (prevNum, input) => prevNum + input,
            '-': (prevNum, input) => prevNum - input,
            '*': (prevNum, input) => prevNum * input,
            '/': (prevNum, input) => prevNum / input,
            '=': (prevNum, input) => prevNum
        }    
    }  
    getInput(el) {
    // Set an input number length limit
        if (this.inputNum.length <= 10) {
    // Store what the user enters
            this.inputNum += el; 
    // // Add to the UI variable
            this.displayValue = this.inputNum;
            
    // Operator switch, allows calculation on the second variable
            if (this.waitingForSecondOp === true){ 
                this.waitingForSecondOp = false;
            } 
        }     
    }
    handleOperators(nextOp){ 
    // Input into integer for below operations, If none it's 0
        this.inputNum = parseFloat(this.inputNum) || 0; 
    
    // Allows you to switch operators
        if (this.operator && this.waitingForSecondOp) {
            this.operator = nextOp; 
            return;  
        }
    
    // No first digit yet, and update the display
        if (this.firstOp == null){
            this.firstOp = this.inputNum;
            this.displayValue = this.inputNum;
        } 
    
    // Operator exists, get result with the chosen op and equation
        else if (this.operator){
            this.prevNum = this.firstOp || 0;
            this.result = this.operators[this.operator](this.prevNum, this.inputNum);   
    // Display the result value
            this.displayValue = this.result;  
    // Reset the first operand and operator switch
            this.firstOp = this.result;
            this.waitingForSecondOp = true;
        }

        this.waitingForSecondOp = true;
        this.operator = nextOp;
    }
    addDec(){
    // Check theres no decimal, add to Num, if it need a 0 will add it
        if (!this.inputNum.includes('.')) {
            this.inputNum += 0 || '.'; 
        } 

    // If you hit a decimal after a OP fix
        if (this.waitingForSecondOp === true){
            return;
        } 
    }
    flipSign(){
        this.inputNum *= -1;
        this.displayValue = this.inputNum;
    }
    percentage(){
    // Percentage the current input value
        this.inputNum = this.inputNum / 100;
        this.displayValue = this.inputNum;
    
    // A result exists, get a percentage of that result
        if (this.result && !this.inputNum) {
            this.prevNum = this.result / 100;
            this.displayValue = this.prevNum;
        }
    }
    clearPrevInput() {
        this.inputNum = '';
    } 
    clearLast(){
        this.displayView.innerHTML = 0;
        this.inputNum = '';   
    }
    clearAll(){
        this.displayView.innerHTML = 0;
        this.inputNum ='';
        this.result = '';
        this.prevNum = '';
        this.nextOp = '';
        this.firstOp = null;
        this.waitingForSecondOp = false;
        this.operator = null;
    }
    updateUI() { 
    // Format the display value
        this.displayValue = parseFloat(this.displayValue).toFixed(2);      
          
    // Display the value to the screen
        this.displayView.innerHTML = this.displayValue;    
    
    // Limit max length of values to be displayed
        if (this.displayValue.length >= 16){  
            this.displayView.innerHTML = 'Digit too big.';
        }

    // If the result is Infinity or NaN display an error
        if (this.result === Infinity || NaN) {
            this.displayView.innerHTML = 'Error';
        } 
    }   
};

const calc = new Calculator();

// Calculator functionality/ Controller
document.querySelector('.calculator__buttons').addEventListener('click', (e) => {
    // Select the targets dataset attribute
    let target = e.target.dataset; 
    
    // Numbers
    if (target.num) {
        // Get the number value and store it
        calc.getInput(target.num);
        calc.updateUI();    
    } 
    
    // Operators
    if (target.op) {
        calc.handleOperators(target.op);
        calc.clearPrevInput();
        calc.updateUI();
    }

    // Decimals
    if (target.dec) {
        calc.addDec();
    }
    
    // Positives / Negatives
    if (target.minusplus) {
        calc.flipSign();
        calc.updateUI();
    }
    
    // Percentages
    if (target.percentage){
        calc.percentage(); 
        calc.updateUI(); 
    }

    // Clear
    if (target.clear){
        calc.clearLast();
    }

    // All Clear
    if (target.clearall) {
        calc.clearAll(); 
    }
});
