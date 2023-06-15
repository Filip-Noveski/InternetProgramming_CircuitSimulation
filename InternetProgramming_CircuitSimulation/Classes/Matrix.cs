using System.Collections;
using System.Numerics;

namespace InternetProgramming_CircuitSimulation.Classes;

public class Matrix<T> : IEnumerable<T[]> where T : INumber<T>
{
    private T[,] _matrix;

    public int RowCount { get => _matrix.GetLength(0); }
    public int ColumnCount { get => _matrix.GetLength(1); }

    public T this[int r, int c]
    {
        get => _matrix[r, c];
        set => _matrix[r, c] = value;
    }
    public T[] this[int r]
    {
        get => Enumerable.Range(0, _matrix.GetLength(1))
            .Select(x => _matrix[r, x])
            .ToArray();
    }

    public Matrix()
    {
        _matrix = new T[0, 0];
    }
    public Matrix(int rows, int columns)
    {
        _matrix = new T[rows, columns];
    }

    /// <summary>
    /// Allocates a matrix of the specified size and return whether all elements were kept.
    /// </summary>
    /// <param name="newRowCount"></param>
    /// <param name="newColCount"></param>
    /// <returns></returns>
    public bool Reallocate(int newRowCount, int newColCount)
    {
        bool ret = RowCount <= newRowCount && ColumnCount <= newColCount;

        T[,] newMatrix = new T[newRowCount, newColCount];

        int iMax = Math.Min(RowCount, newRowCount) - 1;
        int jMax = Math.Min(ColumnCount, newColCount) - 1;
        for (int i = 0; i <= iMax; i++)
        {
            for (int j = 0; j <= jMax; j++) newMatrix[i, j] = _matrix[i, j];
        }

        _matrix = newMatrix;

        return ret;
    }

    public void Add(T[] row)
    {
        if (ColumnCount != row.Length && ColumnCount != 0)
            throw new Exception($"The provided row is not of the appropriate size. " +
                $"Provided size: {row.Length}; Expected size: {ColumnCount}");

        if (ColumnCount == 0)
            Reallocate(1, row.Length);
        else
            Reallocate(RowCount + 1, ColumnCount);

        int i = RowCount - 1;
        for (int j = 0; j <= ColumnCount - 1; j++)
        {
            _matrix[i, j] = row[j];
        }
    }
    public void Add(T[] row, T defaultValue)
    {
        if (ColumnCount < row.Length)
            throw new Exception($"The provided row is too large. " +
                $"Provided size: {row.Length}; Maximum size: {ColumnCount}");

        T[] finalRow = new T[ColumnCount];

        int i = 0;
        for (; i <= row.Length - 1; i++)
        {
            finalRow[i] = row[i];
        }
        for (; i <= ColumnCount - 1; i++)
        {
            finalRow[i] = defaultValue;
        }

        Add(finalRow);
    }

    public void SwapRows(int row1, int row2)
    {
        //Console.WriteLine($"Matrix op: R{row1} ↔ R{row2}");
        for (int i = 0; i <= ColumnCount - 1; i++)
        {
            (_matrix[row1, i], _matrix[row2, i]) = (_matrix[row2, i], _matrix[row1, i]);
        }
        //Console.WriteLine(this.ToString());
    }
    public void SwapColumns(int col1, int col2)
    {
        for (int i = 0; i <= RowCount - 1; i++)
        {
            (_matrix[i, col1], _matrix[i, col2]) = (_matrix[i, col2], _matrix[i, col1]);
        }
    }

    public void AddToRow(int sourceRow, int targetRow)
    {
        AddToRow(sourceRow, targetRow, T.One);
    }
    public void AddToColumn(int sourceColumn, int targetColumn)
    {
        AddToColumn(sourceColumn, targetColumn, T.One);
    }

    public void AddToRow(int sourceRow, int targetRow, T multiplier)
    {
        /*if (multiplier == T.Zero)
            return;*/
        //Console.WriteLine($"Matrix op: {multiplier} * R{sourceRow} + R{targetRow} → R{targetRow}");
        for (int i = 0; i <= ColumnCount - 1; i++)
        {
            _matrix[targetRow, i] += _matrix[sourceRow, i] * multiplier;
        }
        //Console.WriteLine(this.ToString());
    }
    public void AddToColumn(int sourceColumn, int targetColumn, T multiplier)
    {
        for (int i = 0; i <= RowCount - 1; i++)
        {
            _matrix[i, targetColumn] += _matrix[i, sourceColumn] * multiplier;
        }
    }

    public void MultiplyRow(int row, T multiplier)
    {
        /*if (multiplier == T.One)
            return;*/
        //Console.WriteLine($"Matrix op: {multiplier} * R{row} → R{row}");
        for (int i = 0; i <= ColumnCount - 1; i++)
        {
            _matrix[row, i] *= multiplier;
        }
        //Console.WriteLine(this.ToString());
    }
    public void MultiplyColumn(int column, T multiplier)
    {
        for (int i = 0; i <= RowCount - 1; i++)
        {
            _matrix[column, i] *= multiplier;
        }
    }

    /// <summary>
    /// Checks whether rows should be swapped to continue Gauss-Jordan Elimination.
    /// Returns whether it is safe to continue.
    /// </summary>
    /// <param name="sourceIndex"></param>
    /// <param name="targetIndex"></param>
    /// <returns></returns>
    private bool GaussJordanCheckSwap(int sourceIndex, int targetIndex)
    {
        if (_matrix[sourceIndex, sourceIndex] != T.Zero)
            return true;

        for (int i = sourceIndex + 1; i <= RowCount - 1; i++)
        {
            if (i == targetIndex) continue;
            if (_matrix[i, sourceIndex] == T.Zero) continue;
            if (Math.Abs(_matrix[i, sourceIndex].CompareTo(1E-15)) == -1) continue;

            SwapRows(sourceIndex, i);
            return true;
        }

        return false;
    }
    private void GaussJordanIteration(int index)
    {
        for (int i = 0; i <= RowCount - 1; i++)
        {
            if (i == index) continue;

            bool result = GaussJordanCheckSwap(index, i);
            if (!result)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(this.ToString());
                Console.ForegroundColor = ConsoleColor.Gray;
                throw new Exception("The system does not have a solution.");
            }

            T multiplier = -_matrix[i, index] / _matrix[index, index];
            AddToRow(index, i, multiplier);
        }
        MultiplyRow(index, T.One / _matrix[index, index]);
    }
    public void GaussJordan()
    {
        int selectedColumn = 0;
        while (selectedColumn < Math.Min(ColumnCount - 1, RowCount))
        {
            GaussJordanIteration(selectedColumn++);
        }
    }

    public IEnumerator<T[]> GetEnumerator()
    {
        return new MatrixEnumerator(this);
    }
    IEnumerator IEnumerable.GetEnumerator()
    {
        return new MatrixEnumerator(this);
    }

    private class MatrixEnumerator : IEnumerator<T[]>
    {
        private Matrix<T> _instance;
        private int _position = -1;

        public MatrixEnumerator(Matrix<T> matrix)
        {
            _instance = matrix;
        }

        public T[] Current => _instance[_position];

        object IEnumerator.Current => throw new NotImplementedException();

        public void Dispose()
        {
            // intentionally left empty
        }

        public bool MoveNext()
        {
            ++_position;
            return _position < _instance.RowCount;
        }

        public void Reset()
        {
            _position = -1;
        }
    }

    public override string ToString()
    {
        string ret = string.Empty;

        for (int i = 0; i <= RowCount - 1; i++)
        {
            for (int j = 0; j <= ColumnCount - 2; j++)
            {
                //ret += _matrix[i, j].ToString() + ", "; continue;
                ret += string.Format("{0,11:####0.00000}", _matrix[i, j]) + ", ";
                //ret += _matrix[i, j].ToString("00000.00000", null) + ", ";
            }
            //ret += _matrix[i, ColumnCount - 1].ToString() + "\n"; continue;
            ret += string.Format("{0,11:####0.00000}", _matrix[i, ColumnCount - 1]) + "\n";
            //ret += _matrix[i, ColumnCount - 1].ToString("00000.00000", null) + "\n";
        }

        return ret;
    }
}
