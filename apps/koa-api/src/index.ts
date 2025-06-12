import Koa from 'koa';
import Router from '@koa/router';
import {secureMiddleware} from "@middleware/koa";

const app = new Koa();
const router = new Router();

app.use(secureMiddleware())
app.use(router.routes());
app.use(router.allowedMethods());

router.get('', ctx => {
    ctx.body = { message: 'Hello from Koa' };
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
