using System.Runtime.InteropServices;

namespace InternetProgramming_CircuitSimulation.Classes.Electrical;

public class VoltageSourceDC : Component
{
    public static string PathToSymbol => "/images/components/battery.svg";
    public static string UnitString => "V";
    public static string UnitStringHtml => "V";

    public double SourceVoltage { get; protected set; }
    internal override string Description => $"{{ DC Voltage Source: φi = {InPotential:####0.00000}V; φo = {OutPotential:####0.00000}V; U = {Voltage:####0.00000}V; Usrc = {SourceVoltage:####0.00000}V }}";

    public VoltageSourceDC(Component next, double voltage) : base(next)
    {
        SourceVoltage = voltage;
    }
    public VoltageSourceDC(double sourceVoltage) : base()
    {
        SourceVoltage = sourceVoltage;
    }

    internal override void SetSuccessorPotential(ref double current, Junction? successors = null)
    {
        double outPotential = InPotential + SourceVoltage;

        UpdateSuccessors(outPotential, successors);
    }

    internal override void KirchhoffII(ref double totalVoltage, ref double totalResistance)
    {
        if (KirchoffIgnore)
            return;

        totalVoltage += SourceVoltage;
    }
    internal void AddToVoltageSourceGroup(ref Dictionary<VoltageDictionaryKey, List<string>> dict)
    {
        VoltageDictionaryKey key = new()
        {
            Type = typeof(VoltageSourceDC),
            Phase = -1,
            Frequency = -1
        };

        ref List<string>? list = ref CollectionsMarshal.GetValueRefOrAddDefault(dict, key, out _);
        list ??= new();
        list.Add(Id);
    }
    internal static string GetPhaseFunction(VoltageDictionaryKey phase, double multiplier)
    {
        return multiplier >= 0 ? $" + {multiplier}" : $" - {-multiplier}";
    }

    internal override void InvertDirection()
    {
        SourceVoltage *= -1;
    }

    internal override Component GetNewInverted()
    {
        VoltageSourceDC copy = new(SourceVoltage);
        copy.InvertDirection();
        return copy;
    }
}
