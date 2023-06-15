using System.Diagnostics;
using InternetProgramming_CircuitSimulation.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Collections;
using InternetProgramming_CircuitSimulation.Classes;
using InternetProgramming_CircuitSimulation.Classes.Electrical;
using System.Linq.Expressions;
using InternetProgramming_CircuitSimulation.Classes.Json;

namespace InternetProgramming_CircuitSimulation.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [HttpPost]
    public JsonResult Simulate(List<JsonJunction> junctions, List<JsonBranch> branches, string circuitRegime)
    {
        try
		{
			return Json(Circuit.SimulateFromJson(junctions, branches));
		}
        catch (Exception ex)
        {
#if DEBUG
            return Json(new 
            { 
                error = true, 
                message = $"{ex.Message}; {ex.StackTrace}"
            });
#else
            return Json(new 
            { 
                error = true, 
                message = $"{ex.Message}"
            });
#endif
        }
    }

    [HttpPost]
    public JsonResult MeasureValue(List<JsonJunction> junctions, List<JsonBranch> branches, 
        JsonClamp clamp1, JsonClamp clamp2, MeasuredValueType type)
    {
        try
        {
            return Json(Circuit.MeasureValue(junctions, branches, clamp1, clamp2, type));
        }
        catch (Exception ex) 
        when (ex.Message.Equals("The system does not have a solution.", StringComparison.InvariantCultureIgnoreCase))
        {
            return Json("ERR");
        }
        catch (Exception ex)
        {
#if DEBUG
            return Json(new
            {
                error = true,
                message = $"{ex.Message}; {ex.StackTrace}"
            });
#else
            return Json(new 
            { 
                error = true, 
                message = $"{ex.Message}"
            });
#endif
        }
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}