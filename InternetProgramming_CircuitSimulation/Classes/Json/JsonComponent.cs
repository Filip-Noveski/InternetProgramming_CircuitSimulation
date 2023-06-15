namespace InternetProgramming_CircuitSimulation.Classes.Json;

public enum JsonComponentType
{
	Resistor,
	Conductor,
	VoltageSourceDC,
	VoltageSourceSin,
	Amperemeter,
	Voltmeter
}

public class JsonComponent
{
	public string? Id { get; set; }
	public JsonComponentType? Type { get; set; }
	public string? Value { get; set; }
}
