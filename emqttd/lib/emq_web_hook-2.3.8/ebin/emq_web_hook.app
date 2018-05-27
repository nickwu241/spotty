{application, emq_web_hook, [
	{description, "EMQ Webhook Plugin"},
	{vsn, "2.3.8"},
	{id, "v2.3.8-dirty"},
	{modules, ['emq_web_hook','emq_web_hook_app','emq_web_hook_config','emq_web_hook_sup']},
	{registered, [emq_web_hook_sup]},
	{applications, [kernel,stdlib,jsx,clique]},
	{mod, {emq_web_hook_app, []}}
]}.