import javascript

from CallExpr c
where c.getCalleeName() = "existsSync" or c.getCalleeName() = "readFileSync"
select c, c.getLocation(), "Sync method warning"

