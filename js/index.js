class Calculator{
    constructor(){
        this.displayView = document.querySelector('.calculator__screen');
        this.displayValue = 0;
        this.inputNumber = '';
        this.result = ''; 
        this.firstOperator = null;
        this.waitingForSecondOperator = false;
        this.operator = null;
        this.operators = {
            '+': function add(lastNumber, input) { return lastNumber + input },
            '-': function subtract(lastNumber, input) { return lastNumber - input },
            '*': function multiply(lastNumber, input) { return lastNumber * input },
            '/': function divide(lastNumber, input) { return lastNumber / input },
            '=': function equals(lastNumber, input) { return lastNumber }
        }    
    }
    addToDisplay(inputNumber) {
        return this.displayValue = inputNumber;
    }

    getInput(number) {
        // Set an input number length limit
        if (this.inputNumber.length <= 10) {
            // Store what the user enters
            this.inputNumber += number; 
            this.addToDisplay(this.inputNumber);
            
        if (this.waitingForSecondOperator === true){ 
            this.waitingForSecondOperator = false;
            } 
        }     
    }
    handleOperators(nextOperator){ 
    // Input into integer for below operations, If none it's 0
        this.inputNumber = parseFloat(this.inputNumber) || 0; 
    
    // Allows you to switch operators
        if (this.operator && this.waitingForSecondOperator) {
            this.operator = nextOperator; 
            return;  
        }
    
    // No first digit yet, and update the display
        if (this.firstOperator == null){
            this.firstOperator = this.inputNumber;
            this.displayValue = this.inputNumber;
        } 
    
    // Operator exists, get result with the chosen op and equation
        else if (this.operator){
            this.prevNum = this.firstOperator || 0;
            this.result = this.operators[this.operator](this.prevNum, this.inputNumber);   
    // Display the result value
            this.displayValue = this.result;  
    // Reset the first operand and operator switch
            this.firstOperator = this.result;
            this.waitingForSecondOperator = true;
        }

        this.waitingForSecondOperator = true;
        this.operator = nextOperator;
    }
    addDec(){
    // Check theres no decimal, add to Num, if it need a 0 will add it
        if (!this.inputNumber.includes('.')) {
            this.inputNumber += 0 || '.'; 
        } 

    // If you hit a decimal after a OP fix
        if (this.waitingForSecondOperator === true){
            return;
        } 
    }
    flipSign(){
        this.inputNumber *= -1;
        this.displayValue = this.inputNumber;
    }
    percentage(){
    // Percentage the current input value
        this.inputNumber = this.inputNumber / 100;
        this.displayValue = this.inputNumber;
    
    // A result exists, get a percentage of that result
        if (this.result && !this.inputNumber) {
            this.prevNum = this.result / 100;
            this.displayValue = this.prevNum;
        }
    }
    clearPrevInput() {
        this.inputNumber = '';
    } 
    clearLast(){
        this.displayView.innerHTML = 0;
        this.inputNumber = '';   
    }
    clearAll(){
        this.displayView.innerHTML = 0;
        this.inputNumber ='';
        this.result = '';
        this.prevNum = '';
        this.nextOperator = '';
        this.firstOperator = null;
        this.waitingForSecondOperator = false;
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
