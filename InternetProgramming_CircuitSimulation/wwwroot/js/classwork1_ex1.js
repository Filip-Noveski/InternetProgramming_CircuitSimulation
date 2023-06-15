function removeArrayDuplicates(arr) {
    try {
        let newArr = Array();
        for (let i = 0; i <= arr.length - 1; i++) {
            if (newArr.includes(arr[i]))
                continue;

            newArr.push(arr[i]);
        }

        return newArr;
    }
    catch {
        return -1;
    }
}