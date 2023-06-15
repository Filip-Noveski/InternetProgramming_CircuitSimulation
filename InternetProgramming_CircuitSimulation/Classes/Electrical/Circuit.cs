using System.Diagnostics;
using System.Diagnostics.Metrics;
using System.Linq.Expressions;
using System.Reflection.Metadata.Ecma335;
using System.Runtime.InteropServices;
using System.Transactions;
using InternetProgramming_CircuitSimulation.Classes.Json;
using Microsoft.AspNetCore.Components.Server.Circuits;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing.Template;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace InternetProgramming_CircuitSimulation.Classes.Electrical;

public class Circuit
{
    private readonly List<Junction> _junctions;

    public Circuit()
    {
        _junctions = new();
    }
    
    private static Circuit TestCircuit0()
    {
        Circuit circuit = new();
        string junction1 = circuit.CreateJunction();
        string junction2 = circuit.CreateJunction();

        string branchId = circuit.CreateBranch(junction2, junction1);
        Component component = new VoltageSourceDC(9);
        circuit.AddComponent(component, branchId);
        component = new Resistor(300);
        circuit.AddComponent(component, branchId);

        branchId = circuit.CreateBranch(junction1, junction2);
        component = new Resistor(150);
        circuit.AddComponent(component, branchId);

        branchId = circuit.CreateBranch(junction1, junction2);
        component = new Resistor(90);
        circuit.AddComponent(component, branchId);

        circuit.Simulate();

        return circuit;
    }
    private static Circuit TestCircuit1()
    {
        Circuit circuit = new();
        string junction1 = circuit.CreateJunction();
        string junction2 = circuit.CreateJunction();
        string junction3 = circuit.CreateJunction();

        string branchId = circuit.CreateBranch(junction2, junction1);
        Component component = new VoltageSourceDC(9);
        circuit.AddComponent(component, branchId);
        component = new Resistor(330);
        circuit.AddComponent(component, branchId);

        branchId = circuit.CreateBranch(junction1, junction2);
        component = new Resistor(150);
        circuit.AddComponent(component, branchId);

        branchId = circuit.CreateBranch(junction1, junction3);
        component = new Resistor(100);
        circuit.AddComponent(component, branchId);
        component = new Resistor(450);
        circuit.AddComponent(component, branchId);

        branchId = circuit.CreateBranch(junction3, junction2);
        component = new Resistor(330);
        circuit.AddComponent(component, branchId);

        branchId = circuit.CreateBranch(junction3, junction2);
        component = new VoltageSourceDC(5);
        circuit.AddComponent(component, branchId);
        component = new Resistor(120);
        circuit.AddComponent(component, branchId);
        component = new Resistor(500);
        circuit.AddComponent(component, branchId);

        circuit.Simulate();

        return circuit;
    }
    private static Circuit TestCircuit2()
    {
        Circuit circuit = new();
        string junction1 = circuit.CreateJunction();

        string branchId = circuit.CreateBranch(junction1, junction1);
        Component component = new VoltageSourceDC(9);
        circuit.AddComponent(component, branchId);
        component = new Resistor(330);
        circuit.AddComponent(component, branchId);

        circuit.Simulate();

        return circuit;
    }
    private static Circuit TestCircuit3()
    {
        Circuit circuit = new();
        string junction1 = circuit.CreateJunction();

        string branchId = circuit.CreateBranch(junction1, junction1);
        Component component = new VoltageSourceDC(9);
        circuit.AddComponent(component, branchId);
        component = new Resistor(300);
        circuit.AddComponent(component, branchId);
        component = new Resistor(150);
        circuit.AddComponent(component, branchId);

        circuit.Simulate();

        return circuit;
    }
    private static Circuit TestCircuit4()
    {
        Circuit circuit = new();
        string junction1 = circuit.CreateJunction();

        string branchId = circuit.CreateBranch(junction1, junction1);
        Component component = new VoltageSourceDC(9);
        circuit.AddComponent(component, branchId);
        component = new Resistor(300);
        circuit.AddComponent(component, branchId);
        component = new Conductor();
        circuit.AddComponent(component, branchId);
        component = new Resistor(150);
        circuit.AddComponent(component, branchId);

        circuit.Simulate();

        return circuit;
    }
    private static Circuit TestCircuit5()
    {
        Circuit circuit = new();
        string junction1 = circuit.CreateJunction();
        string junction2 = circuit.CreateJunction();

        string branchId = circuit.CreateBranch(junction2, junction1);
        Component component = new VoltageSourceDC(9);
        circuit.AddComponent(component, branchId);
        component = new Resistor(300);
        circuit.AddComponent(component, branchId);

        branchId = circuit.CreateBranch(junction1, junction2);
        component = new Conductor();
        circuit.AddComponent(component, branchId);

        branchId = circuit.CreateBranch(junction1, junction2);
        component = new Resistor(90);
        circuit.AddComponent(component, branchId);

        circuit.Simulate();

        return circuit;
    }
    private static Circuit TestCircuit6()
    {
        Circuit circuit = new();
        string junction1 = circuit.CreateJunction();
        string junction2 = circuit.CreateJunction();
        string junction3 = circuit.CreateJunction();

        string branchId = circuit.CreateBranch(junction2, junction1);
        Component component = new VoltageSourceSin(220, 50);
        circuit.AddComponent(component, branchId);
        component = new Resistor(330);
        circuit.AddComponent(component, branchId);

        branchId = circuit.CreateBranch(junction1, junction2);
        component = new Resistor(150);
        circuit.AddComponent(component, branchId);

        branchId = circuit.CreateBranch(junction1, junction3);
        component = new Resistor(100);
        circuit.AddComponent(component, branchId);
        component = new Resistor(450);
        circuit.AddComponent(component, branchId);

        branchId = circuit.CreateBranch(junction3, junction2);
        component = new Resistor(330);
        circuit.AddComponent(component, branchId);

        branchId = circuit.CreateBranch(junction3, junction2);
        component = new VoltageSourceSin(220, 50, 2.0 / 3.0 * Math.PI);
        circuit.AddComponent(component, branchId);
        component = new Resistor(120);
        circuit.AddComponent(component, branchId);
        component = new Resistor(500);
        circuit.AddComponent(component, branchId);

        circuit.Simulate();

        return circuit;
    }
    public static Circuit GenerateTestCircuit(int index)
    {
        switch (index % 7)
        {
            case 0:
                return TestCircuit0();
            case 1:
                return TestCircuit1();
            case 2:
                return TestCircuit2();
            case 3:
                return TestCircuit3();
            case 4:
                return TestCircuit4();
            case 5:
                return TestCircuit5();
            case 6:
                return TestCircuit6();
            default:
                return new Circuit();
        }
    }

    private static void GenerateCircuitFromJson(
        ref List<JsonJunction> junctions, ref List<JsonBranch> branches,
        out Circuit circuit, out Dictionary<string, string> junctionIds, out Dictionary<string, string> branchIds)
    {
        circuit = new();
        junctionIds = new();
        branchIds = new();

        foreach (JsonJunction junction in junctions)
        {
            string junctionId = circuit.CreateJunction();
            junctionIds.Add(junction.Id!, junctionId);
        }

        foreach (JsonBranch branch in branches)
        {
            string sourceJunction = junctionIds[branch.SourceJunction!];
            string terminalJunction = junctionIds[branch.TerminalJunction!];
            string branchId = circuit.CreateBranch(sourceJunction, terminalJunction);
            branchIds.Add(branch.Id!, branchId);

            circuit.AddComponentsFromJson(branch.Components!, branchId);
        }
    }
    private static void RevertToClientIds(ref List<JsonSimulationData> data,
        ref List<JsonBranch> branches, ref Dictionary<string, string> branchIds)
    {
        for (int i = 0; i <= data.Count - 1; i++)
        {
            string oldId = data[i].BranchId!;
            string newId = branchIds.FirstOrDefault(x => x.Value == oldId).Key;
            data[i].BranchId = newId;
            JsonBranch branch = branches.Find(x => x.Id == newId)!;

            int count = branch.Components!.Count;
            Debug.Assert(count == data[i].Components!.Count, "Component count mismatch");

            for (int j = 0; j <= count - 1; j++)
            {
                data[i].Components![j]
                    .ComponentId = branch.Components[j].Id;
            }
        }
    }
    
    public static object SimulateFromJson(List<JsonJunction> junctions, List<JsonBranch> branches)
	{
        foreach (JsonBranch branch in branches)
        {
            if (branch.IsClosed is null or false)
            {
                throw new Exception($"Branch {branch.Id} is not closed.");
            }
        }

        GenerateCircuitFromJson(ref junctions, ref branches,
            out Circuit circuit, out var junctionIds, out var branchIds);

        /*  For multi-phase circuits (returns strings, thus not fully functional)
        Dictionary<VoltageDictionaryKey, List<string>> voltageSources = circuit.GetAndDisableVoltageSourcesGrouped();
        string method = string.Empty;
        List<JsonSimulationDataTimed>? simData = null;
        foreach (KeyValuePair<VoltageDictionaryKey, List<string>> pair in voltageSources)
        {
            Type type = pair.Key.Type;
            circuit.EnableVoltageSources(pair.Value);
            circuit.Simulate();
            circuit.DisbaleVoltageSources(pair.Value);
            circuit.GetSimulationDataTimedJson(ref simData, pair.Key);
        }

        for (int i = 0; i <= simData!.Count - 1; i++)
        {
            string oldId = simData![i].BranchId!;
            string newId = branchIds.FirstOrDefault(x => x.Value == oldId).Key;
            simData![i].BranchId = newId;
            JsonBranch branch = branches.Find(x => x.Id == newId)!;

            int count = branch.Components!.Count;
            Debug.Assert(count == simData![i].Components!.Count, "Component count mismatch");

            for (int j = 0; j <= count - 1; j++)
            {
                simData![i].Components![j]
                    .ComponentId = branch.Components[j].Id;
            }
        }

        return simData!;
        */

        circuit.Simulate();
        List<JsonSimulationData> data = circuit.GetSimulationDataJson();
        RevertToClientIds(ref data, ref branches, ref branchIds);
		return data;
	}
    
    private static bool ClampIsOnJunction( 
        ref List<JsonBranch> branches, ref JsonClamp clamp, out string? junctionId)
    {
        if (clamp.ConnectionType == ClampConnectionType.ToJunction)
        {
            junctionId = clamp.ConnectionId;
            return true;
        }

        string branchId; 
        JsonBranch branch;

		if (clamp.ConnectionType == ClampConnectionType.ToComponentTerminalNode)
        {
            junctionId = GetJsonBranchTerminalJunctionByComponent(
                clamp.ConnectionId!, ref branches, out branchId);
            branch = branches.Find(x => x.Id == branchId)!;

            if (branch.Components!.Last().Id == clamp.ConnectionId) // is last component
                return true;

            junctionId = null;
            return false;
        }

        // ClampConnectionType.ToComponentSourceNode:
        _ = GetJsonBranchTerminalJunctionByComponent(
				clamp.ConnectionId!, ref branches, out branchId);
        branch = branches.Find(x => x.Id == branchId)!;

        if (branch.Components!.First().Id == clamp.ConnectionId)
        {
            junctionId = branch.SourceJunction;
            return true;
        }

        junctionId = null;
        return false;
	}
    private static string GetJsonBranchTerminalJunctionByComponent(
        string componentId, ref List<JsonBranch> branches, out string branchId)
    {
        foreach (JsonBranch branch in branches)
        {
            foreach (JsonComponent component in branch.Components!)
            {
                if (component.Id == componentId)
                {
                    branchId = branch.Id!;
                    return branch.TerminalJunction!;
                }
            }
        }

        throw new Exception($"The component {componentId} was not found among the branches");
    }
    private static ReadOnlySpan<char> GetOrCreateClampJunction(
        ref List<JsonJunction> junctions, ref List<JsonBranch> branches, ref JsonClamp clamp)
    {
        if (ClampIsOnJunction(ref branches, ref clamp, out string? junctionId))
        {
            return junctionId;
        }

        JsonJunction clampJunction = new() { Id = Guid.NewGuid().ToString() };
        junctions.Add(clampJunction);
        string terminalJunction = GetJsonBranchTerminalJunctionByComponent(
            clamp.ConnectionId!, ref branches, out string branchId);
        string clampConnId = clamp.ConnectionId!;
        JsonBranch parallelBranch = new()
        {
            Id = Guid.NewGuid().ToString(),
            IsClosed = true,
            SourceJunction = clampJunction.Id,
            TerminalJunction = terminalJunction,
            Components = new()
        };

        int branchIndex = branches.FindIndex(x => x.Id == branchId);
        int startIndex = branches[branchIndex].Components!
            .FindIndex(x => x.Id == clampConnId)!;
        if (clamp.ConnectionType == ClampConnectionType.ToComponentTerminalNode)
            startIndex++;

        while (startIndex < branches[branchIndex].Components!.Count)
        {
            parallelBranch.Components.Add(branches[branchIndex].Components![startIndex]);
            branches[branchIndex].Components!.RemoveAt(startIndex);
        }

        branches[branchIndex].TerminalJunction = clampJunction.Id;
        branches.Add(parallelBranch);
        return clampJunction.Id;
    }
    public static double MeasureValue(
        List<JsonJunction> junctions, List<JsonBranch> branches, 
        JsonClamp clamp1, JsonClamp clamp2, MeasuredValueType type)
    {
        ReadOnlySpan<char> clamp1junctionId = GetOrCreateClampJunction(
            ref junctions, ref branches, ref clamp1);
        ReadOnlySpan<char> clamp2junctionId = GetOrCreateClampJunction(
            ref junctions, ref branches, ref clamp2);

        GenerateCircuitFromJson(ref junctions, ref branches,
            out Circuit circuit, out var junctionIds, out _);

        MeasurementComponent meter = type switch
        {
            MeasuredValueType.MultimeterCurrent => new Amperemeter(),
            MeasuredValueType.MultimeterVoltage => new Voltmeter(),
            MeasuredValueType.MultimeterResistance => new Ohmmeter(),
            MeasuredValueType.MultimeterVoltageAC => new VoltmeterAC(circuit.GetMaxPeriodAC()),
            _ => throw new NotImplementedException()
        };
        string internalClamp1JId = junctionIds[clamp1junctionId.ToString()];
        string internalClamp2JId = junctionIds[clamp2junctionId.ToString()];
        string branchId = circuit.CreateBranch(internalClamp1JId, internalClamp2JId);
        circuit.AddComponent(meter, branchId);
        if (meter is VoltmeterAC voltmeterAC)
        {
            Dictionary<VoltageDictionaryKey, List<string>> voltageSources = circuit.GetAndDisableVoltageSourcesGrouped();
            foreach (KeyValuePair<VoltageDictionaryKey, List<string>> pair in voltageSources)
            {
                Type sourceType = pair.Key.Type;
                double frequency = pair.Key.Frequency ?? 0;
                double phase = pair.Key.Phase ?? 0;
                circuit.EnableVoltageSources(pair.Value);
                circuit.Simulate();
                circuit.DisableVoltageSources(pair.Value);
                voltmeterAC.VoltageFuncs.Add(voltmeterAC.GetCurrentPhaseFunc(sourceType, frequency, phase));
            }

            return voltmeterAC.GetMeasuredValue();
        }
        circuit.Simulate();
        return meter.GetMeasuredValue();
    }

    private Branch? GetBranch(string id)
    {
        for (int i = 0; i <= _junctions.Count - 1; i++)
        {
            if (_junctions[i].GetBranch(id) is Branch branch)
                return branch;
        }

        return null;
    }

    public string CreateJunction()
    {
        Junction junction = new();
        _junctions.Add(junction);
        return junction.Id;
    }
    public string CreateBranch(string sourceJunction, string terminalJunction)
    {
        Junction? source = _junctions.Find(x => x.Id == sourceJunction)
            ?? throw new Exception($"The junction {sourceJunction} does not exist.");

        Junction? terminal = _junctions.Find(x => x.Id == terminalJunction)
            ?? throw new Exception($"The junction {terminalJunction} does not exist.");

        Branch branch = new(terminalJunction: terminal);
        source.AddOutgoingBranch(branch);

        return branch.Id;
    }
    public string AddComponent(Component component, string branch)
    {
        Branch branchRef = GetBranch(branch)
            ?? throw new Exception($"The branch {branch} does not exist.");

        branchRef.AddComponentToEnd(component);
        return component.Id;
    }
    private void AddComponentsFromJson(List<JsonComponent> components, string branchId)
    {
        foreach (JsonComponent component in components)
        {
            Component toAdd = component.Type switch
            {
                JsonComponentType.Conductor => new Conductor(),
                JsonComponentType.Resistor => new Resistor(double.Parse(component.Value!)),
                JsonComponentType.VoltageSourceDC => new VoltageSourceDC(double.Parse(component.Value!)),
                JsonComponentType.VoltageSourceSin => new VoltageSourceSin( // provided format: Uef|Freq|Phase
                    effectiveVoltage: double.Parse(component.Value!.AsSpan()[..component.Value!.IndexOf('|')]),
                    frequency: double.Parse(component.Value!.AsSpan()[(component.Value!.IndexOf('|') + 1)..component.Value!.LastIndexOf('|')]),
                    phase: double.Parse(component.Value!.AsSpan()[(component.Value!.LastIndexOf('|') + 1)..])),
                JsonComponentType.Amperemeter => new Amperemeter(),
                JsonComponentType.Voltmeter => new Voltmeter(),
                _ => throw new Exception("JsonComponentType was out of bounds")
            };

            this.AddComponent(toAdd, branchId);
        }
    }

    private string[] GetAllBranchIds()
    {
        int size = 0;
        foreach (Junction junction in _junctions)
        {
            size += junction.OutgoingBranches.Count;
        }

        string[] branchIds = new string[size];

        int idIndex = 0;
        foreach (Junction junction in _junctions)
        {
            for (int i = 0; i <= junction.OutgoingBranches.Count - 1; i++)
            {
                branchIds[idIndex++] = junction.OutgoingBranches[i].Id;
            }
        }

        return branchIds;
    }
    private Branch[] GetAllBranches()
    {
        int size = 0;
        foreach (Junction junction in _junctions)
        {
            size += junction.OutgoingBranches.Count;
        }

        Branch[] branches = new Branch[size];

        int idIndex = 0;
        foreach (Junction junction in _junctions)
        {
            for (int i = 0; i <= junction.OutgoingBranches.Count - 1; i++)
            {
                branches[idIndex++] = junction.OutgoingBranches[i];
            }
        }

        return branches;
    }

    private Dictionary<VoltageDictionaryKey, List<string>> GetVoltageSourcesGrouped()
    {
        Dictionary<VoltageDictionaryKey, List<string>> ret = new();

        foreach (Branch branch in GetAllBranches())
        {
            Component? component = branch.Root;
            while (component is not null)
            {
                if (component is VoltageSourceDC battery)
                    battery.AddToVoltageSourceGroup(ref ret);
                else if (component is VoltageSourceSin sin)
                    sin.AddToVoltageSourceGroup(ref ret);

                component = component.Next;
            }
        }

        return ret;
    }
    private Dictionary<VoltageDictionaryKey, List<string>> GetAndDisableVoltageSourcesGrouped()
    {
        Dictionary<VoltageDictionaryKey, List<string>> ret = new();

        foreach (Branch branch in GetAllBranches())
        {
            Component? component = branch.Root;
            while (component is not null)
            {
                if (component is VoltageSourceDC battery)
                {
                    battery.AddToVoltageSourceGroup(ref ret);
                    component.KirchoffIgnore = true;
                }
                else if (component is VoltageSourceSin sin)
                {
                    sin.AddToVoltageSourceGroup(ref ret);
                    component.KirchoffIgnore = true;
                }

                component = component.Next;
            }
        }

        return ret;
    }
    private double GetMaxPeriodAC()
    {
        Dictionary<VoltageDictionaryKey, List<string>> voltageSources = GetVoltageSourcesGrouped();
        double freq = -1;
        foreach (VoltageDictionaryKey key in voltageSources.Keys)
        {
            if (freq == -1)
            {
                freq = key.Frequency ?? -1;
                continue;
            }
            if (freq != key.Frequency)
                throw new Exception("I couldn't figure this out in time :(");
        }

        foreach (KeyValuePair<VoltageDictionaryKey, List<string>> pair in voltageSources)
        {
            return 1.0 / pair.Key.Frequency ?? throw new NullReferenceException();
        }

        return 0;
    }
    private void EnableVoltageSources(List<string> ids)
    {
        foreach (Branch branch in GetAllBranches())
        {
            Component? component = branch.Root;
            while (component is not null)
            {
                if (component is VoltageSourceDC or VoltageSourceSin && ids.Contains(component.Id))
                    component.KirchoffIgnore = false;

                component = component.Next;
            }
        }
    }
    private void DisableVoltageSources(List<string> ids)
    {
        foreach (Branch branch in GetAllBranches())
        {
            Component? component = branch.Root;
            while (component is not null)
            {
                if (component is VoltageSourceDC or VoltageSourceSin && ids.Contains(component.Id))
                    component.KirchoffIgnore = true;

                component = component.Next;
            }
        }
    }

    private void SimulateLoop(
        ref Matrix<double> matrix, 
        ref string[] branchIds, 
        ref Stack<int> stack, 
        ReadOnlySpan<char> sourceJunctionId)
    {
        double[] matrixRow = new double[branchIds.Length + 1];
        Array.Clear(matrixRow);
        int matrixRowLast = matrixRow.Length - 1;
        double totalVoltage = 0;
        double totalResistance = 0;

        Junction junction = _junctions[0];
        foreach (Junction j in _junctions)
        {
            if (j.Id == sourceJunctionId)
            {
                junction = j;
                break;
            }
        }

        int i = stack.Count - 1;
        Branch branch = junction.OutgoingBranches[stack.ElementAt(i--)];
        Component? component = branch.Root;
        while (true)
        {
            if (component is null)
            {
                // INSERT BRANCH INTO MATRIX
                int index = IndexOfBranch(branch.Id, ref branchIds);
                matrixRow[index] = totalResistance;

                // CHECK LOOP TERMINATION
                if (i == -1)
                    break;

                // SETUP FOR NEXT LOOP
                junction = branch.TerminalJunction;
                branch = junction.OutgoingBranches[stack.ElementAt(i--)];
                component = branch.Root;
                totalResistance = 0;
                continue;
            }

            component.KirchhoffII(ref totalVoltage, ref totalResistance);
            component = component.Next;
        }

        matrixRow[matrixRowLast] = totalVoltage;
        matrix.Add(matrixRow);
    }
    private void SimulateJunction(ref Matrix<double> matrix, ref string[] branchIds, Junction junction)
    {
        double[] matrixRow = new double[branchIds.Length + 1];
        Array.Clear(matrixRow);

        foreach (string branchId in branchIds)
        {
            Branch branch = GetBranch(branchId)!;
            int index = IndexOfBranch(branchId, ref branchIds);
            if (junction.OutgoingBranches.Contains(branch))
            {
                matrixRow[index] -= 1;
            }
            if (branch.TerminalJunction == junction)
            {
                matrixRow[index] += 1;
            }
        }

        matrix.Add(matrixRow);
    }

    /// <summary>
    /// Checks whether the circuit has a single branch and, if so, simulates it and return true,
    /// else returns false and leaves simulation to another method.
    /// </summary>
    /// <returns></returns>
    private bool TestSingleBranch()
    {
        double totalVoltage = 0;
        double totalResistance = 0;
        Branch branch;
        Component? selected;
        if (_junctions.Count == 1 && _junctions[0].OutgoingBranches.Count == 1)
        {
            branch = _junctions[0].OutgoingBranches[0];
            selected = branch.Root;

            while (selected is not null)
            {
                selected.KirchhoffII(ref totalVoltage, ref totalResistance);
                selected = selected.Next;
            }

            branch.SetCurrent(totalVoltage / totalResistance);
            return true;
        }

        foreach (Junction junction in _junctions)
        {
            if (junction.OutgoingBranches.Count > 1)
                return false;
        }

        branch = _junctions[0].OutgoingBranches[0];
        selected = branch.Root;
		ReadOnlySpan<char> sourceId = branch.Id.AsSpan();

		while (selected is not null)
        {
            selected.KirchhoffII(ref totalVoltage, ref totalResistance);

            if (selected.Next is not null)
            {
                selected = selected.Next;
                continue;
            }

            branch = branch.TerminalJunction
                .OutgoingBranches[0];
            selected = branch.Root;
            if (branch.Id == sourceId)
                break;
        }

        foreach (Junction junction in _junctions)
        {
            branch = junction.OutgoingBranches[0];
            branch.SetCurrent(totalVoltage / totalResistance);
        }
        return true;
    }

    private static int IndexOfBranch(string branchId, ref string[] branchIds)
    {
        for (int i = 0; i <= branchIds.Length - 1; i++)
        {
            if (branchIds[i] == branchId)
                return i;
        }

        return -1;
    }

    private bool TestAllSimulationPaths(
        ref Matrix<double> matrix,
        ref string[] branchIds,
        ref Stack<int> stack,
        ReadOnlySpan<char> sourceJunctionId,
        Junction junction)
    {
        for (int i = 0; i <= junction.OutgoingBranches.Count - 1; i++)
        {
            stack.Push(i);
            if (stack.Count > branchIds.Length)
            {   // If selected junction leads to an infinite loop, try another
                string sourceJunctionIdStr = sourceJunctionId.ToString();
                int nextJunctionIndex = _junctions.FindIndex(x => x.Id == sourceJunctionIdStr) + 1;
                Stack<int> loopPath = new();
                TestAllSimulationPaths(ref matrix, ref branchIds, ref loopPath,
                    _junctions[nextJunctionIndex].Id, _junctions[nextJunctionIndex]);
                return true;
            }
            Branch branch = junction.OutgoingBranches[i];
            if (branch.TerminalJunction.Id == sourceJunctionId)
            {
                SimulateLoop(
                    ref matrix,
                    ref branchIds,
                    ref stack,
                    sourceJunctionId);
                stack.Pop();
                continue;
            }
            if (TestAllSimulationPaths(
                ref matrix,
                ref branchIds,
                ref stack,
                sourceJunctionId,
                branch.TerminalJunction))
                    return true;

            stack.Pop();
        }
        return false;
    }

    private (Junction, Branch) GetBranchToJunction(ReadOnlySpan<char> terminalJunction)
    {
        foreach (Junction junction in _junctions)
        {
            foreach (Branch branch in junction.OutgoingBranches)
            {
                if (branch.TerminalJunction.Id == terminalJunction)
                    return (junction, branch);
            }
        }

        throw new Exception("No branch leads to the required junction. Cannot invert.");
    }

    public void FixJunctionIO()
    {
        int len = _junctions.Count;
        Span<bool> hasIncomingBranches = stackalloc bool[len];
        Span<bool> hasOutgoingBranches = stackalloc bool[len];
        foreach (Junction junction in _junctions)
        {
            foreach (Branch branch in junction.OutgoingBranches)
            {
                int index = _junctions.FindIndex(x => x.Id == branch.TerminalJunction.Id);
                hasIncomingBranches[index] = true;
            }
        }

        for (int i = 0; i <= hasIncomingBranches.Length - 1; i++)
        {
            if (hasIncomingBranches[i])
                continue;

            Junction junction = _junctions[i];
            _junctions[i].OutgoingBranches[0].Invert(ref junction);
        }

        for (int i = 0; i <= _junctions.Count - 1; i++)
        {
            hasOutgoingBranches[i] = _junctions[i].OutgoingBranches.Count > 0;
        }

        for (int i = 0; i <= hasOutgoingBranches.Length - 1; i++)
        {
            if (hasOutgoingBranches[i])
                continue;

            (Junction j, Branch b) = GetBranchToJunction(_junctions[i].Id);
            b.Invert(ref j);
        }
    }

    public void Simulate()
    {
        if (_junctions.Count == 0)
            return;

        FixJunctionIO();

        if (TestSingleBranch())
            return;

        Matrix<double> matrix = new();
        string[] branchIds = GetAllBranchIds();
        Stack<int> loopPath = new();

        foreach (Junction junction in _junctions)
        {
            SimulateJunction(ref matrix, ref branchIds, junction);
        }

        TestAllSimulationPaths(ref matrix, ref branchIds, ref loopPath, _junctions[0].Id, _junctions[0]);
        Console.WriteLine(matrix.ToString());
        matrix.GaussJordan();
        Console.WriteLine(matrix.ToString());

        int finalColumn = matrix.ColumnCount - 1;
        for (int i = 0; i <= matrix.RowCount - 1 && i <= matrix.ColumnCount - 2; i++)
        {
            double current = matrix[i, finalColumn];
            string id = branchIds[i];
            Branch branch = GetBranch(id)!;
            branch.SetCurrent(current);
        }
    }

    public string Report()
    {
        Branch[] branches = GetAllBranches();
        string ret = $"{{ Circuit: Branch Count = {branches.Length} }}\n\n";

        foreach (Branch branch in branches)
        {
            ret += branch.Report() + '\n';
        }

        return ret;
    }

    public List<JsonSimulationData> GetSimulationDataJson()
    {
        List<JsonSimulationData> data = new();

        foreach (Junction junction in _junctions)
        {
            data.AddRange(junction.GetSimulationDataJson());
        }

        return data;
    }
    internal void GetSimulationDataTimedJson(
        ref List<JsonSimulationDataTimed>? list, VoltageDictionaryKey phase)
    {
        if (list is not null)
        {
            foreach (Junction junction in _junctions)
            {
                junction.ExpandSimulationDataTimedJson(ref list, phase);
            }
            return;
        }

        list = new();

        foreach (Junction junction in _junctions)
        {
            list.AddRange(junction.GetSimulationDataTimedJson(phase));
        }

        return;
    }
}
