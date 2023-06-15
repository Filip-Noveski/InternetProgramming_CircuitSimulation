namespace InternetProgramming_CircuitSimulation.Classes.Electrical;

public class VoltmeterAC : MeasurementComponent
{
    private static readonly double _resistance = double.MaxValue / 1E+18;   // ~ infinite resistance
    private double _period;

    public List<Func<double, double>> VoltageFuncs { get; set; }
    internal override string Description => $"{{ Voltmeter: φi = {InPotential:####0.00000}V; φo = {OutPotential:####0.00000}V; U = {Voltage:####0.00000}V; R → ∞ }}";

    public VoltmeterAC(double period)
    {
        VoltageFuncs = new();
        _period = period;
    }
    public VoltmeterAC(Component next, double period) : base(next)
    {
        VoltageFuncs = new();
        _period = period;
    }

    public override double GetMeasuredValue()
    {
        double period = _period / 2.0;
        const int intervals = 100;
        double sum = 0;
        for (int i = 0; i <= intervals - 1; i++)
        {
            double t = (double)i / (intervals - 1) * period;
            double val = RunAllVoltageFuncs(t);
            sum += val;
        }

        return Math.Sqrt(sum / intervals);
    }

    private double RunAllVoltageFuncs(double t)
    {
        double ret = 0;
        foreach (Func<double, double> f in  VoltageFuncs)
        {
            ret += Math.Pow(f(t), 2);
        }
        return ret;
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

    internal override void InvertDirection()
    {
    }

    internal override Component GetNewInverted()
    {
        VoltmeterAC copy = new(this._period);
        copy.InvertDirection();
        return copy;
    }

    internal Func<double, double> GetCurrentPhaseFunc(Type type, double frequency, double phase)
    {
        if (type == typeof(VoltageSourceDC))
            return (t) => this.Voltage;

        if (type == typeof(VoltageSourceSin))
        {
            double angVel = 2 * Math.PI * frequency;
            return (t) => this.Voltage * Math.Sqrt(2) * Math.Sin(angVel * t + phase);
        }

        throw new Exception("Unknown voltage source type.");
    }
}
