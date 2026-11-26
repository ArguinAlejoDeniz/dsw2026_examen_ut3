```text
PS D:\Users\Arguin\Documents\GitHub\dsw2026_examen_ut3\ut3> npm run typecheck

> topic-05-backend@1.0.0 typecheck
> tsc --noEmit

src/controllers/articlesController.ts:34:17 - error TS2323: Cannot redeclare exported variable 'create'.

34 export function create(req: Request, res: Response, next: NextFunction): void {
                   ~~~~~~

src/controllers/articlesController.ts:34:17 - error TS2393: Duplicate function implementation.

34 export function create(req: Request, res: Response, next: NextFunction): void {
                   ~~~~~~

src/controllers/articlesController.ts:70:17 - error TS2323: Cannot redeclare exported variable 'create'.

70 export function create(req: Request, res: Response, next: NextFunction): void {
                   ~~~~~~

src/controllers/articlesController.ts:70:17 - error TS2393: Duplicate function implementation.

70 export function create(req: Request, res: Response, next: NextFunction): void {
                   ~~~~~~

src/routes/articles.ts:15:54 - error TS2339: Property 'comprobate' does not exist on type 'typeof import("D:/Users/Arguin/Documents/GitHub/dsw2026_examen_ut3/ut3/src/controllers/articlesController", { with: { "resolution-mode": "import" } })'.

15 articlesRouter.get('/:articleId', articlesController.comprobate);
                                                        ~~~~~~~~~~


Found 5 errors in 2 files.

Errors  Files
     4  src/controllers/articlesController.ts:34
     1  src/routes/articles.ts:15
```

# El npm run typecheck dio error debido a que declare dos funciones con el mismo nombre, ademas da un error extra ya que en un punto del codigo se y hace referencia a 'comprobate' pero nunca a sido declarada ya que le cambie el nombre.


```text
PS D:\Users\Arguin\Documents\GitHub\dsw2026_examen_ut3\ut3> npm run lint 

> topic-05-backend@1.0.0 lint
> eslint .


D:\Users\Arguin\Documents\GitHub\dsw2026_examen_ut3\ut3\src\server.ts
  9:7  error  'sinuso' is assigned a value but never used  @typescript-eslint/no-unused-vars

✖ 1 problem (1 error, 0 warnings)

```
# El npm run lint dio error ya que cree en server.ts una constante "sinuso" a la cual se añadio valor pero jamas se va a usar

```text
PS D:\Users\Arguin\Documents\GitHub\dsw2026_examen_ut3\ut3> npm run build    

> topic-05-backend@1.0.0 build
> tsc

src/services/articlesService.ts:35:9 - error TS2741: Property 'año' is missing in type '{ id: `${string}-${string}-${string}-${string}-${string}`; title: string; description: string; createdAt: string; }' but requiredin type 'Article'.

35   const article: Article = {
           ~~~~~~~

  src/services/articlesService.ts:11:3
    11   año: string;
         ~~~
    'año' is declared here.


Found 1 error in src/services/articlesService.ts:35
```

# El npm run build dio error ya que la variable año se declara pero nunca es usada en la funcion create.