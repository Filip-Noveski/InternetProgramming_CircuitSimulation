namespace InternetProgramming_CircuitSimulation.Classes.Electrical;

public class Voltmeter : MeasurementComponent
{
    private static readonly double _resistance = double.MaxValue / 1E+18;   // ~ infinite resistance

    internal override string Description => $"{{ Voltmeter: φi = {InPotential:####0.00000}V; φo = {OutPotential:####0.00000}V; U = {Voltage:####0.00000}V; R → ∞ }}";

    public Voltmeter()
    {
    }
    public Voltmeter(Component next) : base(next)
    {
    }

    internal override void KirchhoffII(ref double totalVoltage, ref double totalResistance)
    {
        totalResistance += _resistance;
    }

    internal override void SetSuccessorPotential(ref double current, Junction? successors = null)
    {
        if (Next is null)
            return; // don't adjust for correctly connected voltmeter
        
        double voltage = current * _resistance;
        double outPotential = InPotential - voltage;

        UpdateSuccessors(outPotential, successors);
    }

    internal override Component GetNewInverted()
    {
        Voltmeter copy = new();
        copy.InvertDirection();
        return copy;
    }

    public override double GetMeasuredValue() => _direction * this.Voltage;
}
