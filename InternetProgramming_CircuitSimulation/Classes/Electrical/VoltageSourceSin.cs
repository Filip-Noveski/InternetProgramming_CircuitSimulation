using System.Runtime.InteropServices;

namespace InternetProgramming_CircuitSimulation.Classes.Electrical;

public class VoltageSourceSin : Component
{
    public static string PathToSymbol => "/images/components/sinvoltage_hor.svg";
    public static string UnitString => "V";
    public static string UnitStringHtml => "V";

    public double EffectiveVoltage { get; protected set; }
    public double Frequency { get; protected set; }
    public double Phase { get; protected set; }
    public double AngularVelocity => 2 * Math.PI * Frequency;
    public Func<double, double> VoltageInMoment =>
        t => EffectiveVoltage * Math.Sqrt(2) * Math.Sin(AngularVelocity * t + Phase);

    internal override string Description => $"{{ AC Voltage Source: φi = {InPotential:####0.00000}V; φo = {OutPotential:####0.00000}V; U = {Voltage:####0.00000}V; Uef = {EffectiveVoltage:####0.00000}V; u(t) = {(EffectiveVoltage * Math.Sqrt(2)):####0.00000}sin({AngularVelocity}t + {Phase:####0.00000})V }}";

    public VoltageSourceSin(Component next, double voltage, double frequency, double phase) : base(next)
    {
        EffectiveVoltage = voltage;
        Frequency = frequency;
        Phase = phase;
    }
    public VoltageSourceSin(double effectiveVoltage, double frequency, double phase) : base()
    {
        EffectiveVoltage = effectiveVoltage;
        Frequency = frequency;
        Phase = phase;
    }
    public VoltageSourceSin(Component next, double voltage, double frequency) : base(next)
    {
        EffectiveVoltage = voltage;
        Frequency = frequency;
        Phase = 0;
    }
    public VoltageSourceSin(double effectiveVoltage, double frequency) : base()
    {
        EffectiveVoltage = effectiveVoltage;
        Frequency = frequency;
        Phase = 0;
    }

    public static string PathToSymbolRotationBased(double rotation)
    {
        return (rotation % 180) switch
        {
            >= 0 and <= 45 => PathToSymbol,
            > 45 and <= 135 => PathToSymbol.Replace("hor", "ver"),
            > 135 and <= 180 => PathToSymbol,
            _ => throw new Exception("Invalid value for component rotation")
        };
    }
    public static string FormatValue(string value)
    {
        ReadOnlySpan<char> e = stackalloc char[] { 'E' };
        ReadOnlySpan<char> um = value.AsSpan()[..value.IndexOf(" sin")];   // get max voltage
        ReadOnlySpan<char> angVel = value.AsSpan()[(value.IndexOf("(") + 1)..value.IndexOf("t + ")];   // get angular velocity
        ReadOnlySpan<char> phase = value.AsSpan()[(value.IndexOf(" + ") + 3)..value.IndexOf(")")];    // get phase
        double umDouble = double.Parse(um);
        double angVelDouble = double.Parse(angVel);
        double phaseDouble;
        int index = phase.IndexOf(e);
        if (index > -1)
        {
            phaseDouble = double.Parse(phase[..index]) * 
                Math.Pow(10, double.Parse(phase[(index + 1)..]));
        }
        else
        {
            phaseDouble = double.Parse(phase);
        }
        int mul = 0;

        if (umDouble == 0)
            return $"0V";
        if (umDouble == double.PositiveInfinity)
            return $"∞V";
        if (umDouble == double.NegativeInfinity)
            return $"∞V";

        while (umDouble < 1)
        {
            umDouble *= 1000.0;
            mul -= 3;
        }
        while (umDouble >= 1000)
        {
            umDouble /= 1000.0;
            mul += 3;
        }

        return phaseDouble switch
        {
            0 => $"{umDouble:0}sin({angVelDouble:0}t){_multipliers[mul]}V",
            _ => $"{umDouble:0}sin({angVelDouble:0}t+{phaseDouble:0.00}){_multipliers[mul]}V"
        };
    }

    internal override void SetSuccessorPotential(ref double current, Junction? successors = null)
    {
        double outPotential = InPotential + EffectiveVoltage;

        UpdateSuccessors(outPotential, successors);
    }

    internal override void KirchhoffII(ref double totalVoltage, ref double totalResistance)
    {
        if (KirchoffIgnore)
            return;

        totalVoltage += EffectiveVoltage;
    }
    internal void AddToVoltageSourceGroup(ref Dictionary<VoltageDictionaryKey, List<string>> dict)
    {
        VoltageDictionaryKey key = new()
        {
            Type = typeof(VoltageSourceSin),
            Phase = Phase,
            Frequency = Frequency
        };

        ref List<string>? list = ref CollectionsMarshal.GetValueRefOrAddDefault(dict, key, out _);
        list ??= new();
        list.Add(Id);
    }
    internal static string GetPhaseFunction(VoltageDictionaryKey phase, double multiplier)
    {
        string ret = multiplier > 0 ? $" + {multiplier}" : $" - {-multiplier}";
        string angVelocity = $"{(2 * Math.PI * phase.Frequency):0.00000}";
        ret += $" * Math.sin({angVelocity} * t + {phase.Phase})";
        return ret;
    }

    internal override void InvertDirection()
    {
        Phase = (Phase + Math.PI) % (2 * Math.PI);  // Offset by 180 degrees
    }

    internal override Component GetNewInverted()
    {
        VoltageSourceSin copy = new(EffectiveVoltage, Frequency, Phase);
        copy.InvertDirection();
        return copy;
    }
}