namespace InternetProgramming_CircuitSimulation.Classes.Electrical;

public class Ohmmeter : MeasurementComponent
{
    private static readonly double _sourceVoltage = 3;

    internal override string Description => $"{{ Ohmmeter: φi = {InPotential:####0.00000}V; φo = {OutPotential:####0.00000}V; U = {Voltage:####0.00000}V; R = {0:####0.00000}Ω }}";

    public Ohmmeter() : base()
    {
    }
    public Ohmmeter(Component next) : base(next)
    {
    }

    internal override void KirchhoffII(ref double totalVoltage, ref double totalResistance)
    {
        totalVoltage += _sourceVoltage; // add voltage to measure resistance by Ohm's law
    }

    internal override void SetSuccessorPotential(ref double current, Junction? successors = null)
    {
        double outPotential = InPotential + _sourceVoltage;

        UpdateSuccessors(outPotential, successors);
    }

    internal override void InvertDirection()
    {
        // Nothing to change
    }

    internal override Component GetNewInverted()
    {
        Ohmmeter copy = new();
        copy.InvertDirection();
        return copy;
    }

    public override double GetMeasuredValue() => Math.Abs(_sourceVoltage / Parent!.Current);
}
