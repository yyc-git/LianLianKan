dim arg
set arg = WScript.Arguments

if arg.length = 0 then
	WScript.Quit
end if


dim fso, ts

set fso = CreateObject("Scripting.FileSystemObject")
set ts = fso.OpenTextFile(arg(0), 1)


dim txt
txt = ts.ReadAll()
ts.Close

txt = replace(txt, "m_", "this._")
txt = replace(txt, "$", "this.")


dim path
path = replace(arg(0), ".js", ".cls")


set ts = fso.OpenTextFile(path, 2, true)

ts.Write(txt)
ts.Close