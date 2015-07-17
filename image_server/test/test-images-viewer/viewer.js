'use strict';

/* global d3:false */

var fs = require('fs');

var $plotlist = document.getElementById('plot-list'),
    $images = document.getElementById('plot-images'),
    $mock = document.getElementById('plot-mock');

var dirBaseline = '../test-images-baseline/',
    dirTest = '../test-images/',
    dirDiff = '../test-images-diffs/',
    dirMocks = '../mocks/';

var imageNames = fs.readFileSync(
        __dirname + '/list-of-incorrect-images.txt', 'utf8'
    )
    .split('\n')
    .filter(function(x) { return x; })
    .map(function(x) {
        return x.split('diff-')[1].split('.png')[0];
    });

imageNames.forEach(function(imageName) {
    $plotlist.appendChild(createButton(imageName));
});

function createButton(imageName) {
    var button = document.createElement('button');
    button.style.cssFloat = 'left';
    button.style.width = '100px';
    button.style.height = '40px';
    button.innerHTML = imageName;

    button.addEventListener('click', function () {
        var imgBaseline = createImg(dirBaseline, imageName),
            imgTest = createImg(dirTest, imageName),
            imgDiff = createImg(dirDiff, 'diff-' + imageName);

        d3.json(dirMocks + imageName + '.json', function(err, mock) {
            $images.innerHTML = '';
            $images.appendChild(imgBaseline);
            $images.appendChild(imgTest);
            $images.appendChild(imgDiff);

            $mock.innerHTML = '';
            $mock.appendChild(createJSONview(mock));
       });
    });

    return button;
}

function createImg(dir, name) {
    var img = new Image();
    img.src = dir + name + '.png';
    return img;
}

function createJSONview(mock) {
    var jsonView = document.createElement('pre');
    jsonView.innerHTML = JSON.stringify(mock, null, 2);
    return jsonView;
}
