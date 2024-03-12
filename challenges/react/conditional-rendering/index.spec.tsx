import {expect,it,describe} from 'vitest'
import {render} from "@testing-library/react"
//@ts-expect-error
import TodoListWithIcon from './src/components/show-icon'
//@ts-expect-error
import ListItemWithImportance from './src/components/importance'
//@ts-expect-error
import ResultsList from "./src/components/result"


describe('Tests for Conditional Rendering', () => { 
    describe("Tests for ListItem With Status",()=>{
        it("Renders ✅ if Todo is completed",()=>{
            //@ts-expect-error
            const {container} = render(<TodoListWithIcon  title={"Complete challenge on frameground"} completed={true} />)
            expect(container.querySelector("li")?.innerHTML).toBe("Complete challenge on frameground ✅")
        })
        it("Renders ❌ if Todo is not completed",()=>{
            //@ts-expect-error
            const {container} = render(<TodoListWithIcon  title={"Star the frameground repo"} completed={false} />)
            expect(container.querySelector("li")?.innerHTML).toBe("Star the frameground repo ❌")
        })
    })

    describe("Tests for ListItem with importance",()=>{
        it("Renders the li with class red-text if importance is more than 5",()=>{
            //@ts-expect-error            
            const {container} = render(<ListItemWithImportance importance={6} title={"Star the frameground repo"} />)
            expect(container.querySelector("li")?.classList).toContain("red-text")
        })

        it("Renders the li with class red-text if importance is more than 5",()=>{
            //@ts-expect-error
            const {container} = render(<ListItemWithImportance importance={5} title={"Star the frameground repo"} />)
            expect(container.querySelector("li")?.classList.length).toBe(0)
        })
    })

    describe("Tests for ListItem to render Result",()=>{
        it("Renders the subject if user is passed",()=>{
            //@ts-expect-error
            const {container} = render(<ResultsList failed={false} subject={"Computer Science"}  />)
            expect(container.querySelector("li")).toBeTruthy()
        })
        it("Does not render the subject if user is failed",()=>{
            //@ts-expect-error
            const {container} = render(<ResultsList failed={true} subject={"Maths"}  />)
            expect(container.querySelector("li")).toBeFalsy()
        })
    })

 })