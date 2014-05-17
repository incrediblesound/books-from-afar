exports.difference = function(set1, set2) {
	var diff = Difference(set1, set2);
	var result = sum(diff);

	return result;
}

exports.average = function(set) {
	return sum(set)/set.length;
}

exports.deviation = function(set) {
	var avg = sum(set)/set.length;
	var dev = Deviation(set, avg);
	return sum(dev)/dev.length;
}

exports.correlation = function(set1, set2) {
	var avg1 = sum(set1)/set1.length,
		  avg2 = sum(set2)/set2.length,
		  x = deviation(set1, avg1),
		  y = deviation(set2, avg2),
		  xy = multiplyZip(x,y),
		  sumSquares = sum(multiplyZip(x,x))*sum(multiplyZip(y,y))
	var pearson = sum(xy)/Math.sqrt(sumSquares);
	return pearson;
}

function sum(list) {
	var result = 0;
	forEach(list, function(num) {
		result += num;
	})
	return result;
}

function Deviation(list, avg) {
	var result = [];
	forEach(list, function(num) {
		result.push(natural(num-avg));
	})
	return result;	
}

function multiplyZip(list1, list2) {
	var results = [];
	forEach(list1, function(num, i) {
		results.push(num*list2[i]);
	})
	return results;
}

function Difference(list1, list2) {
	var result = [];
	forEach(list1, function (num, i) {
		result.push(natural(num - list2[i]));
	})

	return result;
}

function forEach(array, fn) {
	for(var i = 0; i<array.length;i++) {
		fn(array[i], i);
	}
}

function natural(num) {
	if(num < 0) {
		num = num*(-1)
	}
	return num
}