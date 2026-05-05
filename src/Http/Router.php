<?php

declare(strict_types=1);

namespace Lumemia\Http;

use Closure;

final class Router
{
    /** @var list<array{method:string, regex:string, params:list<string>, handler:callable}> */
    private array $routes = [];

    public function get(string $path, callable $handler): void    { $this->add('GET', $path, $handler); }
    public function post(string $path, callable $handler): void   { $this->add('POST', $path, $handler); }
    public function put(string $path, callable $handler): void    { $this->add('PUT', $path, $handler); }
    public function patch(string $path, callable $handler): void  { $this->add('PATCH', $path, $handler); }
    public function delete(string $path, callable $handler): void { $this->add('DELETE', $path, $handler); }

    private function add(string $method, string $path, callable $handler): void
    {
        $params = [];
        $regex = preg_replace_callback(
            '#\{([a-zA-Z_][a-zA-Z0-9_]*)\}#',
            function (array $m) use (&$params): string {
                $params[] = $m[1];
                return '(?P<' . $m[1] . '>[^/]+)';
            },
            $path,
        );

        $this->routes[] = [
            'method'  => $method,
            'regex'   => '#^' . $regex . '$#',
            'params'  => $params,
            'handler' => $handler,
        ];
    }

    public function dispatch(Request $request): void
    {
        $allowedForPath = [];

        foreach ($this->routes as $route) {
            if (!preg_match($route['regex'], $request->path, $matches)) {
                continue;
            }
            if ($route['method'] !== $request->method) {
                $allowedForPath[] = $route['method'];
                continue;
            }

            $params = [];
            foreach ($route['params'] as $name) {
                $params[$name] = $matches[$name];
            }

            $result = ($route['handler'])($request->withParams($params));
            if ($result !== null) {
                Response::json($result);
            }
            return;
        }

        if ($allowedForPath !== []) {
            header('Allow: ' . implode(', ', array_unique($allowedForPath)));
            Response::error('Method Not Allowed', 405);
            return;
        }

        Response::error('Not Found', 404, ['path' => $request->path]);
    }
}
