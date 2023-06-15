namespace InternetProgramming_CircuitSimulation.Classes.Json;

public class JsonSimulationData
{
	public string? BranchId { get; set; }
	public double? Current { get; set; }
	public List<JsonComponentPotentials>? Components { get; set; }
}
