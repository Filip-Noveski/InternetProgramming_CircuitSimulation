namespace InternetProgramming_CircuitSimulation.Classes.Electrical;

public class Amperemeter : MeasurementComponent
{
    internal override string Description => $"{{ Amperemeter: φi = {InPotential:####0.00000}V; φo = {OutPotential:####0.00000}V; U = {Voltage:####0.00000}V; R = {0:####0.00000}Ω }}";

    public Amperemeter() : base()
    {
    }
    public Amperemeter(Component next) : base(next)
    {
    }

    internal override void KirchhoffII(ref double totalVoltage, ref double totalResistance)
    {
        // Has no resistance
    }

    internal override void SetSuccessorPotential(ref double current, Junction? successors = null)
    {
        double outPotential = InPotential;  // has no resistance, thus no voltage

        UpdateSuccessors(outPotential, successors);
    }

    internal override Component GetNewInverted()
    {
        Amperemeter copy = new();
        copy.InvertDirection();
        return copy;
    }

    public override double GetMeasuredValue() => _direction * Parent!.Current;
}
