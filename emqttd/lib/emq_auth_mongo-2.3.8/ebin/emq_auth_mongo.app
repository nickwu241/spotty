{application, emq_auth_mongo, [
	{description, "Authentication/ACL with MongoDB"},
	{vsn, "2.3.8"},
	{id, "v2.3.8-dirty"},
	{modules, ['emq_acl_mongo','emq_auth_mongo','emq_auth_mongo_app','emq_auth_mongo_config','emq_auth_mongo_sup']},
	{registered, [emq_auth_mongo_sup]},
	{applications, [kernel,stdlib,mongodb,ecpool,clique]},
	{mod, {emq_auth_mongo_app, []}}
]}.