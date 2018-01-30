console.log('ready');
fetch('./js/tree.json').then(r => r.json())
.then(data => {

    const tree = data;
    //console.log(tree);

    const treel1 = tree.children;
    //console.log(treel1.title);

    const lone = document.getElementsByClassName('level__one'[0]);
    [...treel1].forEach(t1 => {
        const a = t1.title;

        if (t1.children != null) {
            //console.log(t1.children);
            [...t1.children].forEach(child => {
                const b = child.title;

                if (child.children != null) {
                    [...child.children].forEach(child3 => {
                        console.log(a +" - " +b  +" - "+child3.title);
                    });
                }
            });
        }
    });


})
.catch(e => console.log(e))

