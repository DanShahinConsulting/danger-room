$(document).ready(function(){

    $dropRegions = $('body')

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
    // $dropRegions.on('dragover', handleDragOver);
    // $dropRegions.on('dragleave', handleDragLeave);


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

    function preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    async function  handleFiles(files,fileType) {
        for (var i = 0, len = files.length; i < len; i++) {
            if (validateImage(files[i])){
                await previewAnduploadImage(files[i],fileType);
            }
        }
    }

    function validateImage(image) {
        // check the type
        var validTypes = ['video/webm', 'video/mp4', 'video/quicktime', 'audio/mpeg'];
        if (validTypes.indexOf( image.type ) === -1) {
            console.error("Invalid File Type: " + image.type );
            return false;
        }
    
        // check the size
        // var maxSizeInBytes = 10e6; // 10MB
        // if (image.size > maxSizeInBytes) {
        //     console.error("File too large");
        //     return false;
        // }
    
        return true;
    
    }

    async function previewAnduploadImage(image,fileType) {
    
        // read the image...
        
        var reader = new FileReader();
        reader.onload = async function(e) {
            let $video = $('video.fg')[0];
            console.log($video)
            $video.src = e.target.result;
            $video.load();
            //$video.play();
            //console.log(e.target.result)
            // savedImages.push({
            //     src: e.target.result
            // })
    
            // await localStorage.setItem(`${fileType}Images`,JSON.stringify(savedImages))
        }
        await reader.readAsDataURL(image);
    
        // create FormData
        var formData = new FormData();
        formData.append('image', image);
    
    }
    
    
});