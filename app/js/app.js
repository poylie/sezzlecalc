angular.module('calculator', ['calculator.data'])
    .controller('CalculatorController', ['$scope', 'socketio', 'Expressions', function ($scope, socketio, Expressions) {
        'use strict';
		
		var calculator = this
		
        calculator.finishedCalculations = Expressions.query();
        
        socketio.on('expression', function (msg) {
            calculator.finishedCalculations.push(msg);
        });
		
		calculator.display = "0"
		calculator.numbers = []
		calculator.operators = []
		calculator.previousNumber = 0
		calculator.currentNumber = 0
		calculator.operationDisplay = ""

		var newNumber = true
		
		calculator.updateOutput = function(value) {
		  if(calculator.display == "0" || newNumber){
			  calculator.display = value.toString()
			  newNumber = false
		  } else{
			  calculator.display = calculator.display.concat(value.toString())
		  }
		  calculator.currentNumber = parseFloat(calculator.display)
		};
		
		calculator.updateOperation = function(value) {
			if(calculator.display != "0"){
				calculator.numbers.push(calculator.currentNumber)
				if(calculator.previousNumber){
					calculator.calculate()
				}
				calculator.operationDisplay = value
				calculator.operators.push(value)
				calculator.newValue()
				
			}
		};
		
		calculator.equals = function() {
			calculator.numbers.push(calculator.currentNumber)
			calculator.calculate()
			calculator.operationDisplay = ""
			calculator.newValue()
			calculator.addExpression()
		}
		
		calculator.newValue = function(){
			calculator.previousNumber = calculator.currentNumber
			newNumber = true
			
		}
		
		calculator.calculate = function() {
			var ans
			if(calculator.operationDisplay && calculator.operationDisplay.length > 0){
				if(calculator.operationDisplay == "+"){
					ans = calculator.previousNumber + calculator.currentNumber
				} else if(calculator.operationDisplay == "-"){
					ans = calculator.previousNumber - calculator.currentNumber
				} else if(calculator.operationDisplay == "*"){
					ans = calculator.previousNumber * calculator.currentNumber
				} else if(calculator.operationDisplay == "/"){
					ans = calculator.previousNumber / calculator.currentNumber
				}
				calculator.display = ans.toString()
				calculator.currentNumber = ans
			}
		};
		
		calculator.clear = function(){
			calculator.display = "0"
			calculator.numbers = []
			calculator.operators = []
			calculator.previousNumber = 0
			calculator.currentNumber = 0
			calculator.operationDisplay = ""
			newNumber = true
		}
		
		calculator.addExpression = function(){
			var expString = ""
			for(var idx = 0; idx < calculator.numbers.length || idx < calculator.operators.length; idx++){
				if(calculator.numbers[idx]){
					expString = expString.concat(calculator.numbers[idx].toString())
				}
				if(calculator.operators[idx]){
					expString = expString.concat(calculator.operators[idx].toString())
				}
			}
			expString = expString.concat("=")
			expString = expString.concat(calculator.currentNumber.toString())
			calculator.numbers = []
			calculator.operators = []
			var id = calculator.finishedCalculations.length + 1
			var expression = {
				id:id,
				expString:expString
			}
			Expressions.save(expression)
			calculator.finishedCalculations = Expressions.query();
		}
    }])
    .factory('socketio', ['$rootScope', function ($rootScope) {
        'use strict';
        
        var socket = io.connect();
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };
    }]);
