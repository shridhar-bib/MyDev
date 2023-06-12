public class AwesomeCalculator {
    public static Double add(Double x, Double y) {
        calculatorServicesSoap.CalculatorImplPort calculator = 
            new calculatorServicesSoap.CalculatorImplPort();
        return calculator.doAdd(x,y);
    }
}