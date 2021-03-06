import * as should from "should";
import {Tree, Class} from "../lib/lang-elements";
import {FileWalker} from "../lib/file-walker";
import {ViewExtendersFilter} from "../lib/view-extenders-filter";
import {InputHandler,Input} from "../lib/input";


// a dummy reference of the should variable so that is import gets included
// to the generated javascript:
var aDummyThing = should;

describe("ViewExtendersFilter", () => {
    var builtTree: Tree = null;
    beforeEach(() => {
        var inputHandler = new InputHandler([]);
        inputHandler.argsResolve = (rawArguments: string[]) => {
            return {
                i: <string[]> [],
                f: <string[]> [],
                o: "tns.xsd",
                r: "tests/resources"
            };
        };
        var allInput = inputHandler.getInput();
        var fileWalker = new FileWalker(allInput.root, allInput.apiFiles);
        builtTree = fileWalker.buildTree();
    });

    describe("run on all files", () => {
        it("should remove classes, marked with @private", () => {

            var classToBeFilteredName = "NativeViewGroup";
            var existingClass: Class = null;
            for (var i=0; i<builtTree.Classes.length; i++) {
                var _class = builtTree.Classes[i];
                if (_class.name === classToBeFilteredName) {
                    existingClass = _class;
                    break;
                }
            }
            existingClass.should.not.eql(null);

            var filter = new ViewExtendersFilter();
            var filteredClasses = builtTree.Classes.filter((_class) => filter.shouldEmit(_class));
            var commentedWithPrivateClass: Class = null;
            for (var i=0; i<filteredClasses.length; i++) {
                var filteredClass = filteredClasses[i];
                if (filteredClass.name === classToBeFilteredName) {
                    commentedWithPrivateClass = filteredClass;
                    break;
                }
            }
            should(commentedWithPrivateClass).be.eql(null);
        });

        it("should leave the ContentView class, though having no members", () => {
            var classToBeLeftFullName = '"ui/content-view".ContentView';
            var existingClass: Class = null;
            for (var i=0; i<builtTree.Classes.length; i++) {
                var _class = builtTree.Classes[i];
                if (_class.fullName === classToBeLeftFullName) {
                    existingClass = _class;
                    break;
                }
            }
            existingClass.should.not.eql(null);

            var filter = new ViewExtendersFilter();
            var filteredClasses = builtTree.Classes.filter((_class) => filter.shouldEmit(_class));
            var contentViewClass: Class = null;
            for (var i=0; i<filteredClasses.length; i++) {
                var filteredClass = filteredClasses[i];
                if (filteredClass.fullName === classToBeLeftFullName) {
                    contentViewClass = filteredClass;
                    break;
                }
            }
            should(contentViewClass).not.eql(null);
        });

        it("should filter classes, not inheriting View", () => {
            var classToBeFilteredName = "Bindable";
            var existingClass: Class = null;
            for (var i=0; i<builtTree.Classes.length; i++) {
                var _class = builtTree.Classes[i];
                if (_class.name === classToBeFilteredName) {
                    existingClass = _class;
                    break;
                }
            }
            existingClass.should.not.eql(null);

            var filter = new ViewExtendersFilter();
            var filteredClasses = builtTree.Classes.filter((_class) => filter.shouldEmit(_class));
            var commentedWithPrivateClass: Class = null;
            for (var i=0; i<filteredClasses.length; i++) {
                var filteredClass = filteredClasses[i];
                if (filteredClass.name === classToBeFilteredName) {
                    commentedWithPrivateClass = filteredClass;
                    break;
                }
            }
            should(commentedWithPrivateClass).be.eql(null);
        });

        it("should return the view class", () => {
            var filter = new ViewExtendersFilter();
            var filteredClasses = builtTree.Classes.filter((_class) => filter.shouldEmit(_class));
            var viewClass: Class = null;
            for (var i=0; i<filteredClasses.length; i++) {
                var filteredClass = filteredClasses[i];
                if (filteredClass.name === "View") {
                    viewClass = filteredClass;
                    break;
                }
            }
            should(viewClass).be.not.eql(null);
        });
    });
});
