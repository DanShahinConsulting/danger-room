$(document).ready(function(){
var // where files are dropped + file selector is opened
$dropRegions = $('.drop-region').not('img'),
dropRegion = $('.drop-region')[0];

let containerType ;

$dropRegions.each( function( index, element ) {
    console.log( $( this ).text() );
    let $dropRegion = $(this),
        containerType = $dropRegion.data('type') ;

    var fakeInput = document.createElement("input");
    fakeInput.type = "file";
    fakeInput.accept = "image/*";
    fakeInput.multiple = true;
    
    
    fakeInput.addEventListener("change", function() {
        var files = fakeInput.files;
        handleFiles(files);
    });
    $dropRegion.on('dragenter', preventDefault)
    $dropRegion.on('dragleave', preventDefault)
    $dropRegion.on('dragover', preventDefault)
    $dropRegion.on('drop', preventDefault)
    
    
    
});
$dropRegions.on('drop', handleDrop);
$dropRegions.on('dragover', handleDragOver);
$dropRegions.on('dragleave', handleDragLeave);

function handleDragOver(e){
    $zone = $(e.target);
    $zone.addClass('drop-enter');
}

function handleDragLeave(e){
    $zone = $(e.target);
    $zone.removeClass('drop-enter');
}

  
function preventDefault(e) {
    e.preventDefault();
    e.stopPropagation();
}



function handleDrop(e) {
    console.log('drop',e)
    var dt = e.originalEvent.dataTransfer,
        files = dt.files,
        fileType = $(e.currentTarget).data('type');
        $zone = $(e.target);
        $zone.removeClass('drop-enter');
        // console.log(e)
        //alert(fileType)

    if (files.length) {

        handleFiles(files,fileType);
        
    } 

}

// dropRegion.addEventListener('drop', handleDrop, false);



function handleFiles(files,fileType) {
    for (var i = 0, len = files.length; i < len; i++) {
        if (validateImage(files[i]))
            previewAnduploadImage(files[i],fileType);
    }
}

function validateImage(image) {
    // check the type
    var validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (validTypes.indexOf( image.type ) === -1) {
        console.error("Invalid File Type");
        return false;
    }

    // check the size
    var maxSizeInBytes = 10e6; // 10MB
    if (image.size > maxSizeInBytes) {
        console.error("File too large");
        return false;
    }

    return true;

}

function previewAnduploadImage(image,fileType) {


    // previewing image
    var img = document.createElement("img");
    img.className = fileType;

    $(`.${fileType} .img-container`).append(img);



    // read the image...
    var reader = new FileReader();
    reader.onload = function(e) {
        img.src = e.target.result;
    }
    reader.readAsDataURL(image);

    // create FormData
    var formData = new FormData();
    formData.append('image', image);

}

});