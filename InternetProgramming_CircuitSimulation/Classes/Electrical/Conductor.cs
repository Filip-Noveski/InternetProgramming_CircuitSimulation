namespace InternetProgramming_CircuitSimulation.Classes.Electrical;

public class Conductor : Component
{
    public static string PathToSymbol => "/images/components/conductor.svg";
    public static string UnitString => string.Empty;
    public static string UnitStringHtml => string.Empty;

    internal override string Description => $"{{ Conductor: φ = {InPotential:####0.00000}V; }}";

    public Conductor(Component next) : base(next)
    {
    }
    public Conductor() : base()
    {
    }

    internal override void SetSuccessorPotential(ref double current, Junction? successors = null)
    {
        double outPotential = InPotential;

        UpdateSuccessors(outPotential, successors);
    }

    internal override void KirchhoffII(ref double totalVoltage, ref double totalResistance)
    {
    }

    internal override void InvertDirection()
    {
        // Nothing to change
    }

    internal override Component GetNewInverted()
    {
        Conductor copy = new();
        copy.InvertDirection();
        return copy;
    }
}
