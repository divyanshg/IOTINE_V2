function reconstructBase64String(chunk) {
    pChunk = JSON.parse(chunk["d"]);

    //creates a new picture object if receiving a new picture, else adds incoming strings to an existing picture 
    if (pictures[pChunk["pic_id"]]==null) {
        pictures[pChunk["pic_id"]] = {"count":0, "total":pChunk["size"], pieces: {}, "pic_id": pChunk["pic_id"]};

        pictures[pChunk["pic_id"]].pieces[pChunk["pos"]] = pChunk["data"];

    }

    else {
        pictures[pChunk["pic_id"]].pieces[pChunk["pos"]] = pChunk["data"];
        pictures[pChunk["pic_id"]].count += 1;


        if (pictures[pChunk["pic_id"]].count == pictures[pChunk["pic_id"]].total) {
        console.log("Image reception compelete");
        var str_image=""; 

        for (var i = 0; i <= pictures[pChunk["pic_id"]].total; i++) 
            str_image = str_image + pictures[pChunk["pic_id"]].pieces[i];

        //displays image
        var source = 'data:image/jpeg;base64,'+str_image;
        var myImageElement = document.getElementById("picture_to_show");
        myImageElement.href = source;
        }

    }

}
