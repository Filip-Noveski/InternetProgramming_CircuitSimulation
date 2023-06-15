using System.Diagnostics;

namespace InternetProgramming_CircuitSimulation.Classes.Electrical;

public abstract class Component
{
    public string Id { get; set; }
    public double InPotential { get; internal set; }
    public double OutPotential
    {
        get
        {
            if (Next is not null)
                return Next.InPotential;

            if (Parent is not null)
            {
                Branch next = Parent
                    .TerminalJunction
                    .OutgoingBranches[0];

                while (next.Root is null)
                    next = next.TerminalJunction
                        .OutgoingBranches[0];

                return next.Root.InPotential;
            }

            throw new Exception("This shouldn't have happened i.e., Parent should not be null.");
        }
    }
    public Component? Next { get; protected set; }
    internal Branch? Parent { get; set; }
    public double Voltage => InPotential - OutPotential;
    public bool KirchoffIgnore { get; set; }
    internal virtual string Description => $"{{ Component: φi = {InPotential:####0.00000}V; φo = {OutPotential:####0.00000}V; U = {Voltage:####0.00000}V }}";

    protected static readonly Dictionary<int, string> _multipliers = new()
    {
        { -24, "y" },   //yocto
        { -21, "z" },   //zepto
        { -18, "a" },   //atto
        { -15, "f" },   //femto
        { -12, "p" },   //pico
        { -9, "n" },    //nano
        { -6, "&mu;" }, //micro
        { -3, "m" },    //milli
        { 0, string.Empty },    //-
        { 3, "k" },     //kilo
        { 6, "M" },     //mega
        { 9, "G" },     //giga
        { 12, "T" },    //tera
        { 15, "P" },    //peta
        { 18, "E" },    //exa
        { 21, "Z" },    //zetta
        { 24, "Y" }     //yotta
    };

    public Component(Component next)
    {
        Id = Guid.NewGuid().ToString();
        Next = next;
        InPotential = 0;
        KirchoffIgnore = false;
    }
    public Component()
    {
        Id = Guid.NewGuid().ToString();
        Next = null;
        InPotential = 0;
        KirchoffIgnore = false;
    }

    public void AddComponentToEnd(Component component)
    {
        if (Next is null)
        {
            Next = component;
            return;
        }

        Next.AddComponentToEnd(component);
    }

    public void InsertComponent(Component component)
    {
        if (Next is null)
        {
            Next = component;
            return;
        }

        component.AddComponentToEnd(Next);
        Next = component;
    }

    public static string FormatValue(string componentType, string value)
    {
        if (value is null or "")
            return string.Empty;
        if (componentType == "VOLTAGESOURCESIN")
            return VoltageSourceSin.FormatValue(value);

        int mul = 0;
        string unit = componentType switch
        {
            "RESISTOR" => Resistor.UnitString,
            "VOLTAGESOURCEDC" => VoltageSourceDC.UnitString,
            "VOLTAGESOURCESIN" => VoltageSourceSin.UnitString,
            "CONDUCTOR" => Conductor.UnitString,
            _ => string.Empty
        };

        double valueDouble = double.Parse(value.Split(unit)[0]);
        if (valueDouble == 0)
            return $"0{unit}";
        if (valueDouble == double.PositiveInfinity)
            return $"∞{unit}";
        if (valueDouble == double.NegativeInfinity)
            return $"∞{unit}";

        while (valueDouble < 1)
        {
            valueDouble *= 1000.0;
            mul -= 3;
        }
        while (valueDouble >= 1000)
        {
            valueDouble /= 1000.0;
            mul += 3;
        }

        return $"{valueDouble:0}{_multipliers[mul]}{unit}";
    }

    internal static void UpdateOverlappingSuccessors(double outPotential, Branch branch)
    {
        if (branch.Root is not null)
        {
            Debug.Assert(true, "Incorrent call of Component.UpdateOverlappingSuccessors() function");
            return;
        }

        foreach (Branch selected in branch.TerminalJunction!.OutgoingBranches)
        {
            if (selected.Root is null)
            {
                UpdateOverlappingSuccessors(outPotential, selected);
                continue;
            }

            selected.Root.InPotential = outPotential;
        }
    }
    internal void UpdateSuccessors(double outPotential, Junction? successors)
    {
        if (Next is not null)
        {
            Next.InPotential = outPotential;
            return;
        }

        if (successors is null)
            return;

        foreach (Branch branch in successors.OutgoingBranches)
        {
            if (branch.Root is null)
            {
                //UpdateOverlappingSuccessors(outPotential, branch);
                continue;
            }

            branch.Root.InPotential = outPotential;
        }
    }
    internal abstract void SetSuccessorPotential(ref double current, Junction? successors = null);
    internal abstract void KirchhoffII(ref double totalVoltage, ref double totalResistance);
    internal abstract void InvertDirection();
    internal abstract Component GetNewInverted();
}
