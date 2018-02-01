console.log('ready');
fetch('./js/tree.json').then(r => r.json())
.then(data => {

    const tree = data;
    //console.log(tree);

    const root = tree.children;

    const lone = document.getElementsByClassName('level__one')[0];

    [...root].forEach(item => {
        const a = item.title;
        lone.innerHTML += `<li class="${item.linkPart}">${item.title}</li>`;
        if (item.children != null ) {
            [...item.children].forEach(child => {

                if (child.children != null && child.linkPart === 'range-rover')  {


                    let liTarget  = document.getElementsByClassName(item.linkPart);
                    [...liTarget].forEach(li=> {
                            li.innerHTML += `
                            <ul class="${item.linkPart}">
                                <li>${child.title}
                                    <ul class="ul__${child.linkPart}">
                                        
                                    </ul>
                                </li>
                            </ul>`;
                    });

                    [...child.children].forEach(cc=> {
                        const level3 = document.getElementsByClassName( 'ul__range-rover');
                        [...level3].forEach(p => {
                            p.innerHTML += `
                            <li>
                               ${cc.title}
                           </li>`;
                        });

                        if (cc.children != null ) {
                            [...cc.children].forEach(child3 => {
                                //p.innerHTML += `<ul class="ul__${cc.title}"></ul>`;
                                console.log(child3);

                            });
                        }
                    });
                }
            });
        }
    });




})
.catch(e => console.log(e))

