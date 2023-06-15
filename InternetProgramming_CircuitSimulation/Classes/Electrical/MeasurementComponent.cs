namespace InternetProgramming_CircuitSimulation.Classes.Electrical;

public abstract class MeasurementComponent : Component
{
    protected short _direction = 1;

    public MeasurementComponent() : base() { }
    public MeasurementComponent(Component next) : base(next) { }

    internal override void InvertDirection()
    {
        _direction *= -1;
    }
    public abstract double GetMeasuredValue();
}
