namespace InternetProgramming_CircuitSimulation.Classes.Electrical;

public class Resistor : Component
{
    public static string PathToSymbol => "/images/components/resistor_a.svg";
    public static string UnitString => "Ω";
    public static string UnitStringHtml => "&Omega;";

    public double Resistance { get; protected set; }
    internal override string Description => $"{{ Resistor: φi = {InPotential:####0.00000}V; φo = {OutPotential:####0.00000}V; U = {Voltage:####0.00000}V; R = {Resistance:####0.00000}Ω }}";

    public Resistor(Component next, double resistance) : base(next)
    {
        Resistance = resistance;
    }
    public Resistor(double resistance) : base()
    {
        Resistance = resistance;
    }

    internal override void SetSuccessorPotential(ref double current, Junction? successors = null)
    {
        double voltage = current * Resistance;
        double outPotential = InPotential - voltage;

        UpdateSuccessors(outPotential, successors);
    }

	internal override void KirchhoffII(ref double totalVoltage, ref double totalResistance)
    {
        if (KirchoffIgnore)
            return;

        totalResistance += Resistance;
	}

    internal override void InvertDirection()
    {
        // Nothing to change
    }

    internal override Component GetNewInverted()
    {
        Resistor copy = new(Resistance);
        copy.InvertDirection();
        return copy;
    }
}
