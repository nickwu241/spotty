{application, emq_retainer, [
	{description, "EMQ Retainer"},
	{vsn, "2.3.8"},
	{id, "v2.3.8-dirty"},
	{modules, ['emq_retainer','emq_retainer_app','emq_retainer_cli','emq_retainer_config','emq_retainer_sup']},
	{registered, [emq_retainer_sup]},
	{applications, [kernel,stdlib,clique]},
	{mod, {emq_retainer_app, []}}
]}.