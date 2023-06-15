using System.Diagnostics.CodeAnalysis;
using System.Dynamic;
using System.Globalization;
using System.Numerics;
using System.Runtime.CompilerServices;

namespace InternetProgramming_CircuitSimulation.Classes;

public sealed class Function<T> : INumber<Function<T>> where T : INumber<T>
{
    private readonly Func<T, T> _function;

    public Function(Func<T, T> function)
    {
        _function = function;
    }

    public T Invoke(T value)
    {
        return _function(value);
    }

    public bool TryInvoke(T value, out T result)
    {
        try
        {
            result = _function(value);
            return true;
        }
        catch
        {
            result = T.Zero;
            return false;
        }
    }

    static Function<T> INumberBase<Function<T>>.One => new Func<T, T>(_ => T.One);

    static int INumberBase<Function<T>>.Radix => T.Radix;

    static Function<T> INumberBase<Function<T>>.Zero => new Func<T, T>(_ => T.Zero);

    static Function<T> IAdditiveIdentity<Function<T>, Function<T>>.AdditiveIdentity => new Func<T, T>(_ => T.Zero);

    static Function<T> IMultiplicativeIdentity<Function<T>, Function<T>>.MultiplicativeIdentity => new Func<T, T>(_ => T.One);

    static Function<T> INumberBase<Function<T>>.Abs(Function<T> value)
    {
        return new Func<T, T>(x => 
            value._function(x) < T.Zero 
                ? -value._function(x) 
                : value._function(x));
    }

    static bool INumberBase<Function<T>>.IsCanonical(Function<T> value)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.IsComplexNumber(Function<T> value)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.IsEvenInteger(Function<T> value)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.IsFinite(Function<T> value)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.IsImaginaryNumber(Function<T> value)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.IsInfinity(Function<T> value)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.IsInteger(Function<T> value)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.IsNaN(Function<T> value)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.IsNegative(Function<T> value)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.IsNegativeInfinity(Function<T> value)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.IsNormal(Function<T> value)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.IsOddInteger(Function<T> value)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.IsPositive(Function<T> value)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.IsPositiveInfinity(Function<T> value)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.IsRealNumber(Function<T> value)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.IsSubnormal(Function<T> value)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.IsZero(Function<T> value)
    {
        throw new NotImplementedException();
    }

    static Function<T> INumberBase<Function<T>>.MaxMagnitude(Function<T> x, Function<T> y)
    {
        throw new NotImplementedException();
    }

    static Function<T> INumberBase<Function<T>>.MaxMagnitudeNumber(Function<T> x, Function<T> y)
    {
        throw new NotImplementedException();
    }

    static Function<T> INumberBase<Function<T>>.MinMagnitude(Function<T> x, Function<T> y)
    {
        throw new NotImplementedException();
    }

    static Function<T> INumberBase<Function<T>>.MinMagnitudeNumber(Function<T> x, Function<T> y)
    {
        throw new NotImplementedException();
    }

    static Function<T> INumberBase<Function<T>>.Parse(ReadOnlySpan<char> s, NumberStyles style, IFormatProvider? provider)
    {
        throw new NotImplementedException();
    }

    static Function<T> INumberBase<Function<T>>.Parse(string s, NumberStyles style, IFormatProvider? provider)
    {
        throw new NotImplementedException();
    }

    static Function<T> ISpanParsable<Function<T>>.Parse(ReadOnlySpan<char> s, IFormatProvider? provider)
    {
        throw new NotImplementedException();
    }

    static Function<T> IParsable<Function<T>>.Parse(string s, IFormatProvider? provider)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.TryConvertFromChecked<TOther>(TOther value, out Function<T> result)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.TryConvertFromSaturating<TOther>(TOther value, out Function<T> result)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.TryConvertFromTruncating<TOther>(TOther value, out Function<T> result)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.TryConvertToChecked<TOther>(Function<T> value, out TOther result)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.TryConvertToSaturating<TOther>(Function<T> value, out TOther result)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.TryConvertToTruncating<TOther>(Function<T> value, out TOther result)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.TryParse(ReadOnlySpan<char> s, NumberStyles style, IFormatProvider? provider, out Function<T> result)
    {
        throw new NotImplementedException();
    }

    static bool INumberBase<Function<T>>.TryParse(string? s, NumberStyles style, IFormatProvider? provider, out Function<T> result)
    {
        throw new NotImplementedException();
    }

    static bool ISpanParsable<Function<T>>.TryParse(ReadOnlySpan<char> s, IFormatProvider? provider, out Function<T> result)
    {
        throw new NotImplementedException();
    }

    static bool IParsable<Function<T>>.TryParse(string? s, IFormatProvider? provider, out Function<T> result)
    {
        throw new NotImplementedException();
    }

    int IComparable.CompareTo(object? obj)
    {
        throw new NotImplementedException();
    }

    int IComparable<Function<T>>.CompareTo(Function<T>? other)
    {
        throw new NotImplementedException();
    }

    bool IEquatable<Function<T>>.Equals(Function<T>? other)
    {
        return this == other;
    }

    string IFormattable.ToString(string? format, IFormatProvider? formatProvider)
    {
        return _function.ToString() ?? "Conversion returned null";
    }

    bool ISpanFormattable.TryFormat(Span<char> destination, out int charsWritten, ReadOnlySpan<char> format, IFormatProvider? provider)
    {
        throw new NotImplementedException();
    }

    // assignment operator
    public static implicit operator Function<T>(Func<T, T> function)
    {
        return new Function<T>(function);
    }

    static Function<T> IUnaryPlusOperators<Function<T>, Function<T>>.operator +(Function<T> value)
    {
        return value;
    }

    static Function<T> IAdditionOperators<Function<T>, Function<T>, Function<T>>.operator +(Function<T> left, Function<T> right)
    {
        return new Func<T, T>(x => left._function(x) + right._function(x));
    }

    static Function<T> IUnaryNegationOperators<Function<T>, Function<T>>.operator -(Function<T> value)
    {
        return new Func<T, T>(x => -value._function(x));
    }

    static Function<T> ISubtractionOperators<Function<T>, Function<T>, Function<T>>.operator -(Function<T> left, Function<T> right)
    {
        return new Func<T, T>(x => left._function(x) - right._function(x));
    }

    static Function<T> IIncrementOperators<Function<T>>.operator ++(Function<T> value)
    {
        return new Func<T, T>(x => value._function(x) + T.One);
    }

    static Function<T> IDecrementOperators<Function<T>>.operator --(Function<T> value)
    {
        return new Func<T, T>(x => value._function(x) - T.One);
    }

    static Function<T> IMultiplyOperators<Function<T>, Function<T>, Function<T>>.operator *(Function<T> left, Function<T> right)
    {
        return new Func<T, T>(x => left._function(x) * right._function(x));
    }

    static Function<T> IDivisionOperators<Function<T>, Function<T>, Function<T>>.operator /(Function<T> left, Function<T> right)
    {
        return new Func<T, T>(x => left._function(x) / right._function(x));
    }

    static Function<T> IModulusOperators<Function<T>, Function<T>, Function<T>>.operator %(Function<T> left, Function<T> right)
    {
        return new Func<T, T>(x => left._function(x) % right._function(x));
    }

    static bool IEqualityOperators<Function<T>, Function<T>, bool>.operator ==(Function<T>? left, Function<T>? right)
    {
        if (left is null && right is null) 
            return true;

        if (left is null || right is null) 
            return false;

        return left._function == right._function;
    }

    static bool IEqualityOperators<Function<T>, Function<T>, bool>.operator !=(Function<T>? left, Function<T>? right)
    {
        return !(left == right);
    }

    static bool IComparisonOperators<Function<T>, Function<T>, bool>.operator <(Function<T> left, Function<T> right)
    {
        throw new NotImplementedException();
    }

    static bool IComparisonOperators<Function<T>, Function<T>, bool>.operator >(Function<T> left, Function<T> right)
    {
        throw new NotImplementedException();
    }

    static bool IComparisonOperators<Function<T>, Function<T>, bool>.operator <=(Function<T> left, Function<T> right)
    {
        throw new NotImplementedException();
    }

    static bool IComparisonOperators<Function<T>, Function<T>, bool>.operator >=(Function<T> left, Function<T> right)
    {
        throw new NotImplementedException();
    }
}
