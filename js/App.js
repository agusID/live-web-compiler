/* 
    DW17-1
    Software Laboratory Center
    dedicated for NAR19-1
*/

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
        (factory((global.dewacoding = {})))
}(this, (function (exports) {
    'use strict'

    // Toggle Menu
    window.onload = function () {
        let flagToggleMenu = false
        function toggleMenuExplorer(){
            var x = document.getElementById("explorer")
            var toggleIcon = document.getElementById("toggleMenuIcon")
            
            if (flagToggleMenu == false) {
                flagToggleMenu = true
              x.style.width = '200px'
              toggleIcon.classList = 'explorer-toggle-menu active'
            } else {
                flagToggleMenu = false
                x.style.width = '0px'
                toggleIcon.classList = 'explorer-toggle-menu'
            }
        }
    
        var toggleMenu = document.getElementById('toggleMenu')
        toggleMenu.onclick = toggleMenuExplorer

        // Explorer List
        var htmlFile = document.getElementById('htmlFile')
        var cssFile = document.getElementById('cssFile')
        var codeTitle = document.getElementById('codeTitle')
        var cssContent = document.getElementById('codeEditorCSS')
        var htmlContent = document.getElementById('codeEditor')

        var state = "html"
        htmlFile.onclick = function(){
            AddClass(htmlFile, "active")
            RemoveClass(cssFile, "active")
            codeTitle.innerHTML = "<i class='fas fa-code icon'></i>index.html"
            htmlContent.style = "max-height: calc(100vh - 140px)"
            cssContent.style = "width:0pxheight:0pxoverflow:hidden"
            editorFocus()
            state = "html"

        }
        cssFile.onclick = function(){
            AddClass(cssFile, "active")
            RemoveClass(htmlFile, "active")
            codeTitle.innerHTML = "<i class='fas fa-file-code icon'></i>style.css"
            cssContent.style = "max-height: calc(100vh - 140px)"
            htmlContent.style = "width:0pxheight:0pxoverflow:hidden"
            editorFocusCSS()
            state = "css"
        }
        let acBox = document.getElementById('acBox')

        const editor = new Editor()
        editor.init()
        let classList = editor.classList
        let tabSize = 4
        let val = ""
        let inTag = false
        let codeContent = editor.getElementById('codeContent')
        codeContent.contentEditable = true

        //  codeContentCSS
        var codeContentCSS = editor.getElementById('codeContentCSS')
        codeContentCSS.contentEditable = true

        var currLineNumber = 1, currLineNumberCSS = 1,
            col
        var deleteCount = 0
        var flagTypeSuggest = false
        var result = editor.getElementById("result").contentWindow.document,
            htmlResult = editor.getElementById("htmlResult"),
            codeArea = document.getElementsByClassName("code-area")[0],
            codeAreaCSS = document.getElementsByClassName("code-area")[1],
            numbers = editor.getElementById("codeNumbers"),
            numbersCSS = editor.getElementById("codeNumbersCSS")

        init()
        initCSS()
        var outerCodeContent = document.getElementById('outerCodeContent')
        var outerCodeContentCSS = document.getElementById('outerCodeContentCSS')

        editor.addEventListener(outerCodeContent, 'click', editorFocus)
        editor.addEventListeners(codeContent, 'keyup keydown keypress', handler)
        editor.addEventListener(codeContent, 'click', getCaret)

        editor.addEventListener(outerCodeContentCSS, 'click', editorFocusCSS)
        editor.addEventListeners(codeContentCSS, 'keyup keydown keypress', cssHandler)
        editor.addEventListener(codeContentCSS, 'click', getCaret)

        const tags = {
            html: {
                attr: ['lang'],
                child: ['head', 'body'],
            },
            head: {
                attr: null,
                child: ['title', 'meta', 'link', 'script'],
            },
            meta: {
                attr: ['name', 'content'],
                child: null,
            },
            body: {
                attr: ['onload', 'class', 'id'],
                child: ['div', 'span'],
            },
            title: {
                attr: null,
                child: null,
            },
            br: {
                attr: null,
                child: null,
            },
            hr: {
                attr: null,
                child: null,
            },
            link: {
                attr: ['rel', 'type', 'href'],
                child: null,
            },
            script: {
                attr: ['src', 'type'],
                child: null,
            },
            input: {
                attr: ['type', 'class', 'id', 'name', 'value', 'placeholder'],
                child: null,
            },
            textarea: {
                attr: ['row', 'col', 'class', 'id', 'name'],
                child: null,
            },
            select: {
                attr: ['class', 'id', 'name'],
                child: ['option'],
            },
            option: {
                attr: ['value'],
                child: null,
            },
            button: {
                attr: ['type', 'class', 'id', 'name'],
                child: null,
            },
            table: {
                attr: ['border', 'width', 'class', 'id', 'collapse'],
                child: ['tr', 'thead', 'tbody', 'tfoot'],
            },
            thead: {
                attr: ['class', 'id'],
                child: ['tr'],
            },
            tbody: {
                attr: ['class', 'id'],
                child: ['tr'],
            },
            tfoot: {
                attr: ['class', 'id'],
                child: ['tr'],
            },
            tr: {
                attr: ['class', 'id'],
                child: ['td', 'th'],
            },
            td: {
                attr: ['class', 'id', 'colspan', 'rowspan'],
                child: ['div', 'span', 'input'],
            },
            h1: {
                attr: ['class', 'id'],
                child: null,
            },
            h2: {
                attr: ['class', 'id'],
                child: null,
            },
            h3: {
                attr: ['class', 'id'],
                child: null,
            },
            tr: {
                attr: ['class', 'id'],
                child: ['td', 'th'],
            },
            span: {
                attr: ['class', 'id'],
                child: null,
            },
            div: {
                attr: ['class', 'id', 'style'],
                child: null,
            },
            img: {
                attr: ['src', 'class', 'id'],
                child: null,
            },
            form: {
                attr: ['method', 'action'],
                child: null,
            },
            a: {
                attr: ['href', 'class', 'target'],
                child: null,
            },
        }

        var attrList = ""

        const attrValue = {
            type: ['text', 'password', 'email', 'number', 'color', 'date', 'time'],
            colspan: [2, 3, 4, 5],
            border: [1, 2, 3, 4, 5],
            rowspan: [2, 3, 4, 5],
            method: ['POST', 'GET'],
            collapse: ['collapse'],
            rel: ['stylesheet', 'shortcut icon'],
            target: ['_blank', '_self', '_parent', '_top', 'framename'],
        }

        function placeCaretAtEnd(el) {
            el.focus()
            if (typeof window.getSelection != "undefined" &&
                typeof document.createRange != "undefined") {
                var range = document.createRange()
                range.selectNodeContents(el)
                range.collapse(false)
                var sel = window.getSelection()
                sel.removeAllRanges()
                sel.addRange(range)
            } else if (typeof document.body.createTextRange != "undefined") {
                var textRange = document.body.createTextRange()
                textRange.moveToElementText(el)
                textRange.collapse(false)
                textRange.select()
            }
        }

        function editorFocus() {
            placeCaretAtEnd(codeContent)
            getCaret()
            updateLine(lastLine)
        }

        function editorFocusCSS() {
            placeCaretAtEnd(codeContentCSS)
            getCaret()
            updateLine(lastLine)
        }

        function handler(e) {
            editor.update()
            let code = (e.keyCode ? e.keyCode : e.which),
                char = e.key,
                type = e.type
            update(e, code, char, type)
        }

        function cssHandler(e) {
            let code = (e.keyCode ? e.keyCode : e.which),
                char = e.key,
                type = e.type

            let shiftKey = e.shiftKey,
                tabKey = (code == 9),
                deleteKey = (code == 46),
                enterKey = (code == 13),
                backspaceKey = (code == 8),
                keyup = (type == 'keyup'),
                keypress = (type == 'keypress'),
                keydown = (type == 'keydown')
            numberingCSS(e)
            if (tabKey && keydown) { // tab key
                e.preventDefault() // this will prevent us from tabbing out of the editor
                let editor = document.getElementById('codeContentCSS'),
                    doc = editor.ownerDocument.defaultView,
                    sel = doc.getSelection(),
                    range = sel.getRangeAt(0)

                let tabText = ""
                for (let i = 0; i < tabSize; i++) tabText += " "

                let tabNode = document.createTextNode(tabText)
                range.insertNode(tabNode)

                range.setStartAfter(tabNode)
                range.setEndAfter(tabNode)

                sel.removeAllRanges()
                sel.addRange(range)
            }
            if (keyup) {
                run()
                // updateLine()
            }
            // update(e, code, char, type)
        }
        function init() {
            var checkLen = codeContent.innerText.match(/\n/g),
                checkLen = (checkLen == null) ? 1 : checkLen.length

            var lines = checkLen + 1

            numbers.innerHTML = ""
            var numberoflines = 0
            for (numberoflines = 1; numberoflines < lines; numberoflines++) {
                numbers.innerHTML += "<div class='line-numbers' data-value=" + numberoflines + ">" + numberoflines + "</div>"
            }

            var obj = editor.createElement('div')
            obj.classList = classList.linesActive
            obj.setAttribute('data-value', 1)
            obj.innerHTML = '<br>'

            editor.appendChild(codeContent, obj)
            codeContent.focus()
            getCaret()
            updateLine()
        }
        function initCSS() {
            var checkLenCSS = codeContentCSS.innerText.match(/\n/g),
                checkLenCSS = (checkLenCSS == null) ? 1 : checkLenCSS.length

            var linesCSS = checkLenCSS + 1

            numbersCSS.innerHTML = ""
            var numberoflinesCSS = 0
            for (numberoflinesCSS = 1; numberoflinesCSS < linesCSS; numberoflinesCSS++) {
                numbersCSS.innerHTML += "<div class='line-numbers' data-value=" + numberoflinesCSS + ">" + numberoflinesCSS + "</div>"
            }

            let obj = editor.createElement('div')
            obj.classList = classList.linesActive
            obj.setAttribute('data-value', 1)
            obj.innerHTML = '/* Strive to be the best and\n achive our biggest dreams */'

            editor.appendChild(codeContentCSS, obj)
            // codeContent.focus()
            // getCaret()
            updateLine()
        }
        let classname = ''
        let currTopSuggestion = 0
        let enterSuggestion = false
        function update(e, code, char, type) {
            let shiftKey = e.shiftKey,
                tabKey = (code == 9),
                deleteKey = (code == 46),
                enterKey = (code == 13),
                backspaceKey = (code == 8),
                keypress = (type == 'keypress'),
                keydown = (type == 'keydown'),
                keyup = (type == 'keyup')

            if(keyup || keydown) 
            {
                try {
                    val = sel.anchorNode.textContent
                    flagTypeSuggest = true
                } catch (error) {
                    val = ''
                    flagTypeSuggest = false
                }
                if(inSuggestion) val = 'all'
                if(enterKey) {
                    // e.preventDefault()
                    try {
                        document.getElementsByClassName('suggestTest')[currTopSuggestion].click()
                        e.preventDefault()
                    } catch (error) {
                        console.error(error)
                    }
                }
                filterSuggestion(val)
                inSuggestion = false
            }
            if(keyup){
                let newLeftPos = (acBox.style.left).substr(0, acBox.style.left.length-2)
                if(char != ' ') 
                {
                    if(deleteKey || backspaceKey) newLeftPos = (parseInt(newLeftPos)-10)
                    else newLeftPos = (parseInt(newLeftPos)+10)
                }
                
                acBox.style.left = newLeftPos + 'px'
            } 
            if (shiftKey && keypress) {
                if (char == '<' || (char == '>' && inTag)) {
                    e.preventDefault()
                    insertElement(codeContent, char)
                }
            }
            // space key
            if ((char === ' ' || char === '=') && keydown && inTag) {
                e.preventDefault()
                insertElement(codeContent, char)
                flagTypeSuggest = false
                deleteCount = 0
            }
            if (tabKey && keydown) { // tab key
                e.preventDefault() // this will prevent us from tabbing out of the editor
                let editor = document.getElementById('codeContent'),
                    doc = editor.ownerDocument.defaultView,
                    sel = doc.getSelection(),
                    range = sel.getRangeAt(0)

                let tabText = ''
                for (let i = 0; i < tabSize; i++) tabText += "\u00a0"

                let tabNode = document.createTextNode(tabText)
                range.insertNode(tabNode)

                range.setStartAfter(tabNode)
                range.setEndAfter(tabNode)

                sel.removeAllRanges()
                sel.addRange(range)
            }

            numbering(e)

            getCaret()
            if (keyup) {
                run()
                updateLine()
            }
        }

        function getCaret() {
            let sel = document.getSelection(),
                nd = sel.anchorNode

            let line = nd.parentElement.getAttribute('data-value')

            if (line == null) {
                try {
                    line = nd.getAttribute('data-value')
                } catch (error) {

                    if(state === 'css')
                        line = currLineNumberCSS
                    else
                        line = currLineNumber
                }

            }
            var currLineElement = nd

            col = getCaretCharacterOffsetWithin(currLineElement)
            col++
            if (line == null) line = 1

            if(state === 'css')
                currLineNumberCSS = line
            else
                currLineNumber = line

            editor.getElementById('status').innerHTML = 'Ln ' + line + ', Col ' + col + '&nbsp&nbsp&nbsp&nbspSpaces: ' + tabSize
            updateLine()

        }
        let flag = false
        var lastLine = 0, lastLineCSS = 0
        
        function numbering(e) {
            let keyCode = (e.keyCode ? e.keyCode : e.which),
                enterKey = (keyCode == 13),
                deleteKey = (keyCode == 46),
                backspaceKey = (keyCode == 8),
                checkLen = codeContent.innerText.match(/\n/g),
                type = e.type,
                keypress = (type == 'keypress'),
                keydown = (type == 'keydown'),
                keyup = (type == 'keyup')

            checkLen = (checkLen == null) ? 1 : checkLen.length

            var lines = checkLen + 1


            //Enter keycode
            if (enterKey && (keydown || keyup)) {
                resetAutoCompleteBox()

                numbers.innerHTML = ''

                let numberOfLines = 0
                for (numberOfLines = 1; numberOfLines < lines; numberOfLines++) {
                    numbers.innerHTML += "<div class='line-numbers' data-value=" + numberOfLines + ">" + numberOfLines + "</div>"
                    if (lastLine < numberOfLines) lastLine = numberOfLines
                }
                flag = true
            }

            if (deleteKey || backspaceKey) {
                if (codeContent.innerText.length == 1 && keydown) {
                    e.preventDefault()
                    return
                }

                var str = ""
                numbers.innerHTML = ""
                let numberOfLines = 0
                if (keydown || keyup) {
                    for (numberOfLines = 1; numberOfLines < lines; numberOfLines++) {
                        str += "<div class='no' data-value=" + numberOfLines + ">" + numberOfLines + "</div>"
                    }
                    flag = false
                    if (currLineNumber > 1) {
                        currLineNumber--
                        flag = false
                    }
                }
                numbers.innerHTML = str
                lastLine = lines - 1
                return
            }
            if (flag && keyup) updateLine()

        }
        function numberingCSS(e) {
            let keyCode = (e.keyCode ? e.keyCode : e.which),
                enterKey = (keyCode == 13),
                deleteKey = (keyCode == 46),
                backspaceKey = (keyCode == 8),
                checkLen = codeContentCSS.innerText.match(/\n/g),
                type = e.type,
                keydown = (type == 'keydown'),
                keyup = (type == 'keyup')

            checkLen = (checkLen == null) ? 1 : checkLen.length

            let lines = checkLen + 1


            //Enter keycode
            if (enterKey && (keydown || keyup)) {
                resetAutoCompleteBox()

                numbersCSS.innerHTML = ""

                let numberOfLines = 0
                for (numberOfLines = 1; numberOfLines < lines; numberOfLines++) {
                    numbersCSS.innerHTML += "<div class='line-numbers' data-value=" + numberOfLines + ">" + numberOfLines + "</div>"
                    if (lastLineCSS < numberOfLines) lastLineCSS = numberOfLines
                }
                flag = true
            }

            if (deleteKey || backspaceKey) {
                if (codeContentCSS.innerText.length == 1 && keydown) {
                    e.preventDefault()
                    return
                }

                var str = ""
                numbersCSS.innerHTML = ""
                let numberOfLines = 0
                if (keydown || keyup) {
                    for (numberOfLines = 1; numberOfLines < lines; numberOfLines++) {
                        str += "<div class='no' data-value=" + numberOfLines + ">" + numberOfLines + "</div>"
                    }
                    flag = false
                    if (currLineNumberCSS > 1) {
                        currLineNumberCSS--
                        flag = false
                    }

                }
                numbersCSS.innerHTML = str
                lastLineCSS = lines - 1
                return
            }
            // if (flag && keyup) updateLine()

        }
        function updateLine(lastLine = null) {
            var collections = document.querySelectorAll('.dw.lines')
            let currIdx = (lastLine == null) ? currLineNumber : lastLine
            currIdx--

            let lastIdx = 0

            collections.forEach(function (div, i) {
                collections[i].setAttribute('data-value', (i + 1))
                if (collections[i].classList.contains('active')) {
                    lastIdx = i
                }
            })

            if (currIdx < 0) currIdx = 0
            collections[lastIdx].classList = classList.lines
            collections[currIdx].classList = classList.linesActive

        }
        function updateLineCSS(lastLine = null) {
            var collections = document.querySelectorAll('.dw.lines')
            let currIdx = (lastLine == null) ? currLineNumberCSS : lastLine
            currIdx--

            let lastIdx = 0

            collections.forEach(function (div, i) {
                collections[i].setAttribute('data-value', (i + 1))
                if (collections[i].classList.contains('active')) {
                    lastIdx = i
                }
            })

            if (currIdx < 0) currIdx = 0
            collections[lastIdx].classList = classList.lines
            collections[currIdx].classList = classList.linesActive

        }

        function run() {
            result.open()
            result.writeln(
                
                codeContent.textContent+
                "<style>" + codeContentCSS.textContent+ "</style>"
                
            )

            result.close()

        }

        function searchAttrList(tagName) {
            attrList = ""
            try {
                attrList = tags[tagName].attr
            } catch (error) {
                attrList = null
            }

            return attrList
        }

        function searchAttribute(tagName) {
            let attrName = ""
            try {
                attrName = tags[tagName].attr[0]
            } catch (error) {
                attrName = "attr"
            }

            return attrName
        }

        function isOrContainsNode(ancestor, descendant) {
            var node = descendant
            while (node) {
                if (node === ancestor) {
                    return true
                }
                node = node.parentNode
            }
            return false
        }

        var sel, range, html, flagAttr = false
        var isSuggest = false, inSuggestion = false

        function createNode(nodeType, node, el, value, range, className, rangeStart, rangeEnd) {
            if (nodeType == 'tag') {
                var textNode = editor.createTextNode(value)
                node = editor.createElement(el)
                node.classList = className
                node.appendChild(textNode)
            } else if (nodeType == 'text') {
                node = editor.createTextNode(value)
            } else if (nodeType == 'attr') {
                node = editor.createTextNode(' ')
                range.insertNode(node)
                range.setStartAfter(node)
                range.setEndAfter(node)

                var textNode = editor.createTextNode(value)
                node = editor.createElement(el)
                node.classList = className
                node.appendChild(textNode)

            } else if (nodeType == 'string') {
                node = editor.createTextNode('=')
                range.insertNode(node)
                range.setStartAfter(node)
                range.setEndAfter(node)
                var textNode = editor.createTextNode("\"value\"")
                node = editor.createElement(el)
                node.classList = className
                node.appendChild(textNode)
                range.insertNode(node)
                range.setStart(node.childNodes[0], 1)
                range.setEnd(node.childNodes[0], 6)
                return
            }
            range.insertNode(node)

            // check range before or after
            rangeStart == 'after' ? range.setStartAfter(node) : range.setStartBefore(node)
            rangeEnd == 'after' ? range.setEndAfter(node) : range.setEndBefore(node)
        }

        function singleTags(tag) {
            let tags = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']
            for (let i = 0; i < tags.length; i++)
                if (tags[i] == tag) return true
            return false
        }

        function resetAutoCompleteBox() {
            acBox.innerHTML = ''
            acBox.classList = 'box-autocomplete hide'
        }
        function hideAutoCompleteBox(){
            acBox.classList = 'box-autocomplete hide'
        }
        function showAutoCompleteBox(){
            acBox.classList = 'box-autocomplete show'
        }

        var x = ''
        function chooseSuggestion(attrList) {
            let acBoxContent = '<ul>'
            let activeClass = ''
            
            for (let i = 0; i < attrList.length; i++) {

                if (i == 0) activeClass = ' active' 

                acBoxContent += "<li class='suggestTest " + attrList[i] + activeClass + " show' data-value='" + attrList[i] + "'>" + attrList[i] + "</li>"
                activeClass = ''
            }

            acBoxContent += "</ul>"
            acBox.innerHTML = acBoxContent
            acBox.classList = "box-autocomplete show"

            x = document.getElementsByClassName("suggestTest")

        }

        function filterSuggestion(c){
            if (c === "all") c = ""
            let count = 0
            let len = 0
            try {
                len = attrList.length
            } catch (error) {
                return
            }
            let min = len
            for(let i = 0; i < len; i++){
                RemoveClass(x[i], "show")
                RemoveClass(x[i], "active")
                var el = ""
                try {
                    el = x[i].getAttribute('data-value')
                } catch (error) {
                    return
                }

                if(el.indexOf(c) >= 0) {
                    min = (i < min) ? i : min
                    if(x[i].getAttribute('data-value') == c) 
                        AddClass(x[i], "active")
                    
                    AddClass(x[i], "show")
                    count++
                    AddClass(x[min], "active")
                } 
            }
            
            currTopSuggestion = min
            
            if(count == 0) {
                hideAutoCompleteBox()
                return
            }
            showAutoCompleteBox()
            
        }
        // Show filtered elements
        function AddClass(element, name) {
            var i, arr1, arr2
            arr1 = element.className.split(" ")
            arr2 = name.split(" ")
            for (i = 0; i < arr2.length; i++) {
                if (arr1.indexOf(arr2[i]) == -1) 
                    element.className += " " + arr2[i]
            }
        }

        // Hide elements that are not selected
        function RemoveClass(element, name) {
            
            var i, arr1, arr2
            
            try {
                arr1 = element.className.split(" ")
            } catch (error) {
                return
            }

            arr2 = name.split(" ")
            for (i = 0; i < arr2.length; i++) {
                while (arr1.indexOf(arr2[i]) > -1) {
                    arr1.splice(arr1.indexOf(arr2[i]), 1)
                }
            }
            element.className = arr1.join(" ")
        }

        function insertElement(containerNode, key) {

            range = window.getSelection().getRangeAt(0)

            if (window.getSelection) {
                sel = window.getSelection()

                if (sel.getRangeAt && sel.rangeCount) {
                    range = sel.getRangeAt(0)
                    var node = sel.anchorNode

                    if (isOrContainsNode(containerNode, range.commonAncestorContainer)) {

                        let tagName, className, nodeType, prevNode
                        range.deleteContents()
                        switch (key) {
                            case '<':
                                inTag = true
                                nodeType = 'tag'
                                className = classList.brackets
                                createNode(nodeType, node, 'span', '<', range, className, 'after', 'after')

                                className = classList.tag
                                createNode(nodeType, node, 'span', ' ', range, className, 'before', 'after')

                                break
                            case ' ':
                                flagTypeSuggest = false
                                // console.log("Flag Type Suggest : " + flagTypeSuggest)
                                let attrName = 'attr'
                                prevNode = node.parentNode.childNodes[0]
                                tagName = prevNode.textContent
                                tagName = tagName.toLowerCase().split(' ')[0]

                                attrName = searchAttribute(tagName)

                                node = sel.anchorNode.parentNode
                                range.setStartAfter(node)
                                range.setEndAfter(node)

                                nodeType = 'attr'
                                className = classList.attr
                                createNode(nodeType, node, 'span', ' ', range, className, 'before', 'after')
                                flagAttr = true

                                node = node.parentNode.childNodes[2]

                                attrList = searchAttrList(tagName)
                                let leftPos = node.nextSibling.offsetLeft + 'px'
                                let topPos = 20 + node.previousSibling.offsetTop + 'px'
                                acBox.style.left = leftPos
                                acBox.style.top = topPos


                                if (attrList == null) break
                                let firstLen = 0
                                firstLen = attrList[0].length

                                chooseSuggestion(attrList)
                                
                                var classname = document.getElementsByClassName("suggestTest")
                            

                                for (var i = 0; i < attrList.length; i++) {
                                    classname[i].addEventListener('click', myFunction, false)
                                }
                                inSuggestion = true
                                filterSuggestion("all")
                                break
                            case '=':
                                resetAutoCompleteBox()
                                node = sel.anchorNode.parentNode

                                if (!isSuggest) range.setStartAfter(node)
                                isSuggest = false
                                nodeType = 'string'
                                className = classList.string
                                createNode(nodeType, node, 'span', 'string', range, className, 'before', 'after')
                                flagAttr = true

                                break
                            case '>':
                                resetAutoCompleteBox()
                                inTag = false
                                nodeType = 'tag'

                                node = sel.anchorNode.parentNode
                                range.setStartAfter(node)
                                range.setEndAfter(node)

                                className = classList.brackets
                                createNode(nodeType, node, 'span', '>', range, className, 'after', 'after')

                                node = node.nextSibling
                                range.setStartAfter(node)
                                range.setEndAfter(node)

                                prevNode = node.previousSibling
                                if (flagAttr == true)
                                    prevNode = node.parentNode.childNodes[1]
                                tagName = prevNode.textContent
                                tagName = tagName.toLowerCase().split(' ')[0]

                                if (singleTags(tagName)) break

                                nodeType = 'text'
                                createNode(nodeType, node, null, ' ', range, null, 'after', 'after')

                                nodeType = 'tag'
                                className = classList.brackets
                                createNode(nodeType, node, 'span', '</', range, className, 'after', 'after')

                                className = classList.tag
                                createNode(nodeType, node, 'span', tagName, range, className, 'after', 'after')

                                node = editor.createElement('span')
                                node.classList = classList.brackets
                                node.innerHTML = '&gt'
                                range.insertNode(node)

                                node = node.previousSibling.previousSibling.previousSibling
                                range.setStartBefore(node)
                                range.setEndAfter(node)
                                flagAttr = false
                                break
                        }

                        sel.removeAllRanges()
                        sel.addRange(range)

                    } else {
                        containerNode.appendChild(node)
                    }
                }
            } else if (document.selection && document.selection.createRange) {
                range = document.selection.createRange()
                if (isOrContainsNode(containerNode, range.parentElement())) {
                    html = (node.nodeType == 3) ? node.data : node.outerHTML
                    range.pasteHTML(html)
                } else {
                    containerNode.appendChild(node)
                }
            }

        }
        function myFunction() {
            let node = sel.anchorNode
            if(flagTypeSuggest){
                range.setEndAfter(node)
                sel.removeAllRanges()
                sel.addRange(range)

                document.execCommand('delete')
                document.execCommand('delete')
                for (let i = 0; i < deleteCount; i++) {
                    range.setEndAfter(node)
                    sel.removeAllRanges()
                    sel.addRange(range)
                    document.execCommand('delete')
                }
            }else{
                range.setEndAfter(node)
                sel.removeAllRanges()
                sel.addRange(range)

                document.execCommand('delete')
                document.execCommand('delete')
            }
            // flagTypeSuggest = false
            var value = this.getAttribute("data-value")

            let nodeType = 'attr'
            let className = classList.attr

            createNode(nodeType, node, 'span', value, range, className, 'after', 'after')
            resetAutoCompleteBox()

            sel.removeAllRanges()
            sel.addRange(range)
            isSuggest = true
            insertElement(codeContent, '=')
            return
        }
        function getCaretCharacterOffsetWithin(element) {
            var caretOffset = 0

            var doc = element.ownerDocument || element.document
            var win = doc.defaultView || doc.parentWindow
            var sel
            if (typeof win.getSelection != "undefined") {
                sel = win.getSelection()
                if (sel.rangeCount > 0) {
                    var range = win.getSelection().getRangeAt(0)
                    var preCaretRange = range.cloneRange()
                    preCaretRange.selectNodeContents(element)
                    preCaretRange.setEnd(range.endContainer, range.endOffset)
                    caretOffset = preCaretRange.toString().length
                }
            } else if ((sel = doc.selection) && sel.type != "Control") {
                var textRange = sel.createRange()
                var preCaretTextRange = doc.body.createTextRange()
                preCaretTextRange.moveToElementText(element)
                preCaretTextRange.setEndPoint("EndToEnd", textRange)
                caretOffset = preCaretTextRange.text.length
            }

            return caretOffset
        }
    }

    Object.defineProperty(exports, '__esModule', {
        value: true
    })
})))