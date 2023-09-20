
window.addEventListener("load", (event) => {

    const url = 'https://raw.githubusercontent.com/karldaeubel/PenAndPaperFloorplanner/master/examples/Example.json';
    gitHubExampleRequest = new XMLHttpRequest(); // object
    gitHubExampleRequest.onload = function(data) {

        console.log(data.currentTarget.response)
        const content = data.currentTarget.response;
        let floorPlanner;
        try {
            floorPlanner = JSON.parse(content);
        }
        catch (err) {
            alert(getText(loc.fileIO.errorAtFile) + " " + file.name + ".\n\n" + getText(loc.fileIO.errorMessage) + "\n" + err);
            console.error(err);
            return;
        }
        graph.reset();
        labels.length = 0;
        openables.length = 0;
        furniture.length = 0;
        floorplanImage.reset();
        if (floorPlanner.graph) {
            graph.count = floorPlanner.graph.count;
            for (const id in floorPlanner.graph.nodes) {
                const node = floorPlanner.graph.nodes[id];
                graph.nodes[node.id] = new CornerNode(node.id, node.p.x, node.p.y);
            }
            for (const i in floorPlanner.graph.edges) {
                for (const j in floorPlanner.graph.edges[i]) {
                    const edge = floorPlanner.graph.edges[i][j];
                    graph.addEdge(edge.id1, edge.id2);
                }
            }
        }
        if (floorPlanner.labels) {
            for (const label of floorPlanner.labels) {
                labels.push(loadRectangle(label));
            }
        }
        if (floorPlanner.openables) {
            for (const openable of floorPlanner.openables) {
                openables.push(loadOpenable(openable, graph));
            }
        }
        if (floorPlanner.furniture) {
            for (const fur of floorPlanner.furniture) {
                switch (fur.mov.type) {
                    case MovableType.Circle: {
                        furniture.push(loadCircle(fur));
                        break;
                    }
                    case MovableType.Ellipse: {
                        furniture.push(loadEllipse(fur));
                        break;
                    }
                    case MovableType.Rectangle:
                    case MovableType.L:
                    case MovableType.U: {
                        furniture.push(loadRectangle(fur));
                        break;
                    }
                }
            }
        }
        if (floorPlanner.floorplanImage && floorPlanner.floorplanImage.image) {
            const floorplanImageJson = floorPlanner.floorplanImage;
            const img = new Image();
            img.onload = (onLoadResult) => {
                const image = onLoadResult.target;
                floorplanImage.image = image;
                setState();
                drawMain();
            };
            img.onerror = () => {
                alert(getText(loc.fileIO.errorAtFile) + ".");
            };
            img.src = floorplanImageJson.image;
            floorplanImage.distance = floorplanImageJson.distance;
            const node1 = floorplanImageJson.node1;
            floorplanImage.node1 = new CornerNode(node1.id, node1.p.x, node1.p.y);
            const node2 = floorplanImageJson.node2;
            floorplanImage.node2 = new CornerNode(node2.id, node2.p.x, node2.p.y);
        }
        setState();
        drawMain();
    }
    gitHubExampleRequest.open("GET", url);
    gitHubExampleRequest.send();

});