namespace InternetProgramming_CircuitSimulation.Classes.Json;

public class JsonSimulationDataTimed
{
	public string? BranchId { get; set; }
	public string? Current { get; set; }
	public List<JsonComponentPotentialsTimed>? Components { get; set; }
}
